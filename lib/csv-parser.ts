/**
 * Utilitário para processamento de arquivos CSV
 *
 * Este arquivo contém funções para:
 * - Buscar e analisar dados CSV de URLs
 * - Converter texto CSV em objetos JavaScript
 * - Processar linhas CSV com suporte a valores entre aspas
 * - Lidar com diferentes formatos de dados (números, booleanos, etc.)
 */

/**
 * Busca e analisa dados CSV de uma URL
 * @param url A URL do arquivo CSV a ser buscado
 * @returns Uma Promise que resolve para um array de objetos analisados
 */
export async function fetchAndParseCSV<T>(url: string): Promise<T[]> {
  try {
    console.log(`Buscando CSV de: ${url}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/csv,text/plain",
      },
      cache: "no-store", // Evitar cache para sempre obter dados atualizados
    })

    if (!response.ok) {
      throw new Error(`Falha ao buscar CSV: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    console.log(`Content-Type: ${contentType}`)

    const csvText = await response.text()

    // Log primeiras linhas para debug
    const previewLines = csvText.split("\n").slice(0, 3).join("\n")
    console.log(`Prévia do CSV (primeiras 3 linhas):\n${previewLines}`)

    if (!csvText.trim()) {
      throw new Error("CSV está vazio")
    }

    return parseCSV<T>(csvText)
  } catch (error) {
    console.error("Erro ao buscar ou analisar CSV:", error)
    throw error
  }
}

/**
 * Analisa texto CSV em um array de objetos
 * @param csvText O texto CSV a ser analisado
 * @returns Um array de objetos com chaves da linha de cabeçalho
 */
export function parseCSV<T>(csvText: string): T[] {
  // Dividir o texto CSV em linhas
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "")

  if (lines.length === 0) {
    console.warn("CSV não contém linhas válidas")
    return []
  }

  // Extrair cabeçalhos (primeira linha)
  const headers = parseCSVLine(lines[0]).map((header) => header.trim())
  console.log("Cabeçalhos CSV:", headers)

  if (headers.length === 0) {
    console.warn("CSV não contém cabeçalhos válidos")
    return []
  }

  // Analisar linhas de dados
  const results: T[] = []

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i]
    const values = parseCSVLine(currentLine)

    if (values.length !== headers.length) {
      console.warn(
        `Pulando linha ${i + 1}: contagem de colunas incompatível. Esperado ${headers.length}, obtido ${values.length}`,
      )
      continue
    }

    const obj: Record<string, any> = {}

    headers.forEach((header, index) => {
      // Ignorar cabeçalhos vazios
      if (!header) return

      // Converter para tipos apropriados se necessário
      const value = values[index]

      // Ignorar valores vazios
      if (value === "") {
        obj[header] = null
        return
      }

      // Tentar analisar números
      if (/^\d+$/.test(value)) {
        obj[header] = Number.parseInt(value, 10)
      } else if (/^\d+\.\d+$/.test(value)) {
        obj[header] = Number.parseFloat(value)
      } else if (value.toLowerCase() === "true") {
        obj[header] = true
      } else if (value.toLowerCase() === "false") {
        obj[header] = false
      } else {
        obj[header] = value
      }
    })

    // Verificar se o objeto tem pelo menos uma propriedade
    if (Object.keys(obj).length > 0) {
      results.push(obj as T)
    }
  }

  console.log(`Analisadas ${results.length} linhas do CSV`)
  return results
}

/**
 * Analisa uma linha CSV, tratando valores entre aspas corretamente
 * @param line Uma única linha de um arquivo CSV
 * @returns Um array de valores da linha
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      // Tratar aspas
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Aspas duplas dentro de aspas - adicionar uma única aspa
        current += '"'
        i++
      } else {
        // Alternar modo de aspas
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      // Fim do campo
      result.push(current.trim())
      current = ""
    } else {
      // Adicionar caractere ao campo atual
      current += char
    }
  }

  // Adicionar o último campo
  result.push(current.trim())

  return result
}
