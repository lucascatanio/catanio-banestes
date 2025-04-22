/**
 * Utilitários de formatação
 *
 * Este arquivo contém funções para formatar diferentes tipos de dados:
 * - CPF/CNPJ: Formata documentos no padrão brasileiro
 * - Moeda: Formata valores monetários em reais (R$)
 * - Data: Formata datas em (DD/MM/YYYY)
 * - Tipo de conta: Formata tipos de conta bancária
 * - Estado civil: Formata estado civil com primeira letra maiúscula
 */

/**
 * Formata um CPF (11 dígitos) ou CNPJ (14 dígitos)
 * @param value O CPF ou CNPJ a ser formatado
 * @returns CPF ou CNPJ formatado
 */
export function formatCpfCnpj(value?: string): string {
  // Verificar se o valor é undefined ou null
  if (!value) {
    return "N/A"
  }

  // Remover caracteres não numéricos
  const numbers = value.replace(/\D/g, "")

  if (numbers.length === 11) {
    // Formatar como CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  } else if (numbers.length === 14) {
    // Formatar como CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  // Retornar original se não for um CPF ou CNPJ válido
  return value
}

/**
 * Formata um valor monetário para o formato brasileiro (R$)
 * @param value O valor a ser formatado
 * @returns Valor formatado como moeda
 */
export function formatCurrency(value?: number): string {
  if (value === undefined || value === null) {
    return "R$ 0,00"
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/**
 * Formata uma data para o formato (DD/MM/YYYY)
 * @param value A data a ser formatada
 * @returns Data formatada
 */
export function formatDate(value?: Date | string): string {
  if (!value) {
    return "N/A"
  }

  try {
    const date = value instanceof Date ? value : new Date(value)
    return date.toLocaleDateString("pt-BR")
  } catch (error) {
    console.error("Erro ao formatar data:", error)
    return String(value)
  }
}

/**
 * Formata o tipo de conta para exibição
 * @param tipo O tipo de conta ("corrente" ou "poupanca")
 * @returns Tipo de conta formatado
 */
export function formatTipoConta(tipo?: string): string {
  if (!tipo) {
    return "Tipo não especificado"
  }

  const tipos: Record<string, string> = {
    corrente: "Conta Corrente",
    poupanca: "Conta Poupança",
  }

  return tipos[tipo] || tipo
}

/**
 * Formata o estado civil para exibição com primeira letra maiúscula
 * @param estadoCivil O estado civil
 * @returns Estado civil formatado
 */
export function formatEstadoCivil(estadoCivil?: string): string {
  if (!estadoCivil) {
    return "Não informado"
  }

  return estadoCivil.charAt(0).toUpperCase() + estadoCivil.slice(1)
}
