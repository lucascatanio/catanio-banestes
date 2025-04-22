/**
 * Dados de exemplo para o sistema
 *
 * Este arquivo contém dados fictícios para:
 * - Clientes: Informações pessoais e financeiras
 * - Contas: Dados de contas bancárias
 * - Agências: Informações sobre agências bancárias
 *
 * Estes dados são usados como fallback quando não é possível
 * carregar os dados reais das planilhas da url google docs.
 */
import type { Cliente, Conta, Agencia } from "@/types"

// Dados de exemplo para agências
export const mockAgencias: Agencia[] = [
  {
    id: "1",
    codigo: 1001,
    nome: "Agência Central",
    endereco: "Av. Paulista, 1000, São Paulo - SP",
  },
  {
    id: "2",
    codigo: 1002,
    nome: "Agência Norte",
    endereco: "Rua das Flores, 123, Rio de Janeiro - RJ",
  },
  {
    id: "3",
    codigo: 1003,
    nome: "Agência Sul",
    endereco: "Av. Beira Mar, 500, Florianópolis - SC",
  },
]

// Dados de exemplo para contas
export const mockContas: Conta[] = [
  {
    id: "1",
    cpfCnpjCliente: "123.456.789-00",
    tipo: "corrente",
    saldo: 5250.75,
    limiteCredito: 10000,
    creditoDisponivel: 8500,
  },
  {
    id: "2",
    cpfCnpjCliente: "123.456.789-00",
    tipo: "poupanca",
    saldo: 15000,
    limiteCredito: 0,
    creditoDisponivel: 0,
  },
  {
    id: "3",
    cpfCnpjCliente: "987.654.321-00",
    tipo: "corrente",
    saldo: 3200.5,
    limiteCredito: 5000,
    creditoDisponivel: 4000,
  },
  {
    id: "4",
    cpfCnpjCliente: "111.222.333-44",
    tipo: "corrente",
    saldo: 1800.25,
    limiteCredito: 3000,
    creditoDisponivel: 2500,
  },
]

// Dados de exemplo para clientes
export const mockClientes: Cliente[] = [
  {
    id: "1",
    cpfCnpj: "123.456.789-00",
    rg: "12.345.678-9",
    dataNascimento: new Date("1980-05-15"),
    nome: "João Silva",
    nomeSocial: "",
    email: "joao.silva@email.com",
    endereco: "Rua das Flores, 123, Jardim Primavera, São Paulo - SP",
    rendaAnual: 120000,
    patrimonio: 500000,
    estadoCivil: "Casado",
    codigoAgencia: 1001,
  },
  {
    id: "2",
    cpfCnpj: "987.654.321-00",
    rg: "98.765.432-1",
    dataNascimento: new Date("1975-10-20"),
    nome: "Maria Oliveira",
    nomeSocial: "",
    email: "maria.oliveira@email.com",
    endereco: "Av. Central, 456, Centro, Rio de Janeiro - RJ",
    rendaAnual: 90000,
    patrimonio: 350000,
    estadoCivil: "Casado",
    codigoAgencia: 1002,
  },
  {
    id: "3",
    cpfCnpj: "111.222.333-44",
    rg: "11.222.333-4",
    dataNascimento: new Date("1990-03-25"),
    nome: "Ana Santos",
    nomeSocial: "",
    email: "ana.santos@email.com",
    endereco: "Alameda dos Anjos, 50, Paraíso, São Paulo - SP",
    rendaAnual: 75000,
    patrimonio: 200000,
    estadoCivil: "Solteiro",
    codigoAgencia: 1001,
  },
  {
    id: "4",
    cpfCnpj: "444.555.666-77",
    rg: "44.555.666-7",
    dataNascimento: new Date("1985-07-12"),
    nome: "Carlos Ferreira",
    nomeSocial: "",
    email: "carlos.ferreira@email.com",
    endereco: "Rua das Montanhas, 321, Serra, Belo Horizonte - MG",
    rendaAnual: 110000,
    patrimonio: 450000,
    estadoCivil: "Divorciado",
    codigoAgencia: 1003,
  },
  {
    id: "5",
    cpfCnpj: "777.888.999-00",
    rg: "77.888.999-0",
    dataNascimento: new Date("1982-12-05"),
    nome: "Fernanda Lima",
    nomeSocial: "",
    email: "fernanda.lima@email.com",
    endereco: "Rua do Sol, 77, Boa Viagem, Recife - PE",
    rendaAnual: 95000,
    patrimonio: 320000,
    estadoCivil: "Casado",
    codigoAgencia: 1002,
  },
]
