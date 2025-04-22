/**
 * Definições de tipos do sistema
 *
 * Este arquivo contém as interfaces que definem a estrutura de dados para:
 * - Cliente: Informações pessoais e financeiras dos clientes
 * - Conta: Dados das contas bancárias
 * - Agência: Informações sobre agências bancárias
 * - ClienteCompleto: Tipo estendido que combina cliente com suas contas e agência
 */
export interface Cliente {
  id: string
  cpfCnpj: string
  rg?: string
  dataNascimento: Date | string
  nome: string
  nomeSocial?: string
  email: string
  endereco: string
  rendaAnual: number
  patrimonio: number
  estadoCivil: "Solteiro" | "Casado" | "Viúvo" | "Divorciado"
  codigoAgencia: number
}

export interface Conta {
  id: string
  cpfCnpjCliente: string
  tipo: "corrente" | "poupanca"
  saldo: number
  limiteCredito: number
  creditoDisponivel: number
}

export interface Agencia {
  id: string
  codigo: number
  nome: string
  endereco: string
}

// Tipo estendido para uso na interface, combinando cliente com suas contas e agência
export interface ClienteCompleto extends Cliente {
  contas?: Conta[]
  agencia?: Agencia
}

export type Client = Cliente
export type Account = Conta
export type Branch = Agencia
