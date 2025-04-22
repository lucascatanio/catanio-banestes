/**
 * Serviço de dados do sistema
 *
 * Este arquivo é responsável por:
 * - Carregar dados de clientes, contas e agências das planilhas
 * - Processar e normalizar os dados para garantir tipos corretos
 * - Relacionar os dados entre si (clientes com suas contas e agências)
 * - Fornecer dados de exemplo como fallback em caso de falha
 */
import { fetchAndParseCSV } from "./csv-parser"
import { mockClientes, mockContas, mockAgencias } from "./mock-data"
import type { Cliente, Conta, Agencia, ClienteCompleto } from "@/types"

// URLs para os dados CSV
const URLS = {
  clientes:
    "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes",
  contas:
    "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas",
  agencias:
    "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias",
}

/**
 * Carrega todos os dados necessários (clientes, contas e agências)
 * e os relaciona para uso na interface
 */
export async function carregarDadosCompletos(): Promise<{
  clientes: ClienteCompleto[]
  usandoDadosExemplo: boolean
}> {
  let usandoDadosExemplo = false

  try {
    console.log("Iniciando carregamento de dados...")

    // Tentar carregar dados reais
    let clientesData, contasData, agenciasData

    try {
      // Carregar todos os dados em paralelo
      const results = await Promise.all([
        fetchAndParseCSV<any>(URLS.clientes),
        fetchAndParseCSV<any>(URLS.contas),
        fetchAndParseCSV<any>(URLS.agencias),
      ])

      clientesData = results[0]
      contasData = results[1]
      agenciasData = results[2]

      console.log("Dados carregados com sucesso:", {
        clientes: clientesData?.length || 0,
        contas: contasData?.length || 0,
        agencias: agenciasData?.length || 0,
      })

      // Verificar se temos dados válidos
      if (!clientesData?.length || !contasData?.length || !agenciasData?.length) {
        throw new Error("Dados insuficientes carregados das planilhas")
      }
    } catch (fetchError) {
      console.warn("Erro ao carregar dados reais, usando dados de exemplo:", fetchError)
      // Usar dados de exemplo se houver erro
      clientesData = mockClientes
      contasData = mockContas
      agenciasData = mockAgencias
      usandoDadosExemplo = true
    }

    // Processar os dados para garantir tipos corretos
    const clientes = processarClientes(clientesData)
    const contas = processarContas(contasData)
    const agencias = processarAgencias(agenciasData)

    console.log("Dados processados:", {
      clientes: clientes.length,
      contas: contas.length,
      agencias: agencias.length,
    })

    // Relacionar os dados
    const clientesCompletos = relacionarDados(clientes, contas, agencias)

    return {
      clientes: clientesCompletos,
      usandoDadosExemplo,
    }
  } catch (error) {
    console.error("Erro ao carregar dados completos:", error)

    // Em caso de erro, retornar dados de exemplo
    const clientes = processarClientes(mockClientes)
    const contas = processarContas(mockContas)
    const agencias = processarAgencias(mockAgencias)
    const clientesCompletos = relacionarDados(clientes, contas, agencias)

    return {
      clientes: clientesCompletos,
      usandoDadosExemplo: true,
    }
  }
}

/**
 * Processa os dados de clientes para garantir tipos corretos
 */
function processarClientes(clientes: any[]): Cliente[] {
  if (!clientes || !Array.isArray(clientes)) {
    console.warn("Dados de clientes inválidos:", clientes)
    return []
  }

  return clientes
    .filter((cliente) => cliente && (cliente.id || cliente.cpfCnpj)) // Filtrar entradas inválidas
    .map((cliente) => ({
      id: cliente.id || `id-${Math.random().toString(36).substr(2, 9)}`,
      cpfCnpj: cliente.cpfCnpj ? String(cliente.cpfCnpj) : "", // Garantir que seja string
      rg: cliente.rg ? String(cliente.rg) : undefined,
      dataNascimento: parseDate(cliente.dataNascimento),
      nome: cliente.nome ? String(cliente.nome) : "Nome não informado",
      nomeSocial: cliente.nomeSocial ? String(cliente.nomeSocial) : undefined,
      email: cliente.email ? String(cliente.email) : "",
      endereco: cliente.endereco ? String(cliente.endereco) : "",
      rendaAnual: parseNumber(cliente.rendaAnual, 0),
      patrimonio: parseNumber(cliente.patrimonio, 0),
      estadoCivil: cliente.estadoCivil ? String(cliente.estadoCivil) : "Não informado",
      codigoAgencia: parseNumber(cliente.codigoAgencia, 0),
    }))
}

/**
 * Processa os dados de contas para garantir tipos corretos
 */
function processarContas(contas: any[]): Conta[] {
  if (!contas || !Array.isArray(contas)) {
    console.warn("Dados de contas inválidos:", contas)
    return []
  }

  return contas
    .filter((conta) => conta && (conta.id || conta.cpfCnpjCliente)) // Filtrar entradas inválidas
    .map((conta) => ({
      id: conta.id ? String(conta.id) : `id-${Math.random().toString(36).substr(2, 9)}`,
      cpfCnpjCliente: conta.cpfCnpjCliente ? String(conta.cpfCnpjCliente) : "", // Garantir que seja string
      tipo: conta.tipo ? String(conta.tipo) : "corrente",
      saldo: parseNumber(conta.saldo, 0),
      limiteCredito: parseNumber(conta.limiteCredito, 0),
      creditoDisponivel: parseNumber(conta.creditoDisponivel, 0),
    }))
}

/**
 * Processa os dados de agências para garantir tipos corretos
 */
function processarAgencias(agencias: any[]): Agencia[] {
  if (!agencias || !Array.isArray(agencias)) {
    console.warn("Dados de agências inválidos:", agencias)
    return []
  }

  return agencias
    .filter((agencia) => agencia && (agencia.id || agencia.codigo)) // Filtrar entradas inválidas
    .map((agencia) => ({
      id: agencia.id ? String(agencia.id) : `id-${Math.random().toString(36).substr(2, 9)}`,
      codigo: parseNumber(agencia.codigo, 0),
      nome: agencia.nome ? String(agencia.nome) : "Agência sem nome",
      endereco: agencia.endereco ? String(agencia.endereco) : "",
    }))
}

/**
 * Relaciona os dados de clientes, contas e agências
 */
function relacionarDados(clientes: Cliente[], contas: Conta[], agencias: Agencia[]): ClienteCompleto[] {
  return clientes.map((cliente) => {
    // Encontrar todas as contas do cliente
    const contasDoCliente = contas.filter(
      (conta) =>
        conta.cpfCnpjCliente &&
        cliente.cpfCnpj &&
        normalizarDocumento(conta.cpfCnpjCliente) === normalizarDocumento(cliente.cpfCnpj),
    )

    // Encontrar a agência do cliente
    const agenciaDoCliente = agencias.find((agencia) => agencia.codigo === cliente.codigoAgencia)

    // Retornar cliente com suas contas e agência
    return {
      ...cliente,
      contas: contasDoCliente.length > 0 ? contasDoCliente : undefined,
      agencia: agenciaDoCliente,
    }
  })
}

/**
 * Normaliza um documento (CPF/CNPJ) removendo caracteres não numéricos
 * para facilitar a comparação
 */
function normalizarDocumento(doc: any): string {
  // Garantir que doc seja uma string
  if (doc === null || doc === undefined) {
    return ""
  }

  // Converter para string se não for
  const docString = String(doc)

  // Remover caracteres não numéricos
  return docString.replace(/[^\d]/g, "")
}

/**
 * Converte um valor para número, com valor padrão em caso de falha
 */
function parseNumber(value: any, defaultValue = 0): number {
  if (value === undefined || value === null) {
    return defaultValue
  }

  if (typeof value === "number") {
    return value
  }

  try {
    // Converter para string primeiro
    const valueString = String(value)

    // Remover caracteres não numéricos, exceto ponto e vírgula
    const cleanValue = valueString.replace(/[^\d.,]/g, "").replace(",", ".")

    const parsed = Number.parseFloat(cleanValue)
    return isNaN(parsed) ? defaultValue : parsed
  } catch (error) {
    return defaultValue
  }
}

/**
 * Converte um valor para data, com valor padrão em caso de falha
 */
function parseDate(value: any): Date {
  if (!value) {
    return new Date()
  }

  if (value instanceof Date) {
    return value
  }

  try {
    // Tentar converter para data
    const date = new Date(value)
    return isNaN(date.getTime()) ? new Date() : date
  } catch (error) {
    return new Date()
  }
}
