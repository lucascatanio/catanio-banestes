/**
 * Página principal do sistema de gerenciamento de clientes
 *
 * Este componente é responsável por:
 * - Carregar e gerenciar os dados dos clientes
 * - Implementar a busca e filtragem de clientes
 * - Gerenciar a paginação dos resultados
 * - Exibir detalhes de um cliente selecionado
 * - Tratar erros e estados de carregamento
 */
"use client"

import { useState, useEffect } from "react"
import { ClientList } from "@/components/client-list"
import { ClientDetails } from "@/components/client-details"
import { SearchFilters } from "@/components/search-filters"
import { Pagination } from "@/components/pagination"
import { BanestesHeader } from "@/components/banestes-header"
import { carregarDadosCompletos } from "@/lib/data-service"
import type { ClienteCompleto } from "@/types"
import { Loader } from "@/components/ui/loader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertCircle } from "lucide-react"
import { useClientesPerPage } from "@/hooks/use-clientesPerPage"

export default function ClientManagementPage() {
  const [clientes, setClientes] = useState<ClienteCompleto[]>([])
  const [filteredClientes, setFilteredClientes] = useState<ClienteCompleto[]>([])
  const [selectedCliente, setSelectedCliente] = useState<ClienteCompleto | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usandoDadosExemplo, setUsandoDadosExemplo] = useState(false)

  const clientesPerPage = useClientesPerPage() //Define o número de clientes exibidos na lista de acordo com o tamanho da tela.

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const { clientes: clientesData, usandoDadosExemplo: usandoExemplo } = await carregarDadosCompletos()

        setClientes(clientesData)
        setFilteredClientes(clientesData)
        setUsandoDadosExemplo(usandoExemplo)

        if (clientesData.length === 0) {
          setError("Não foram encontrados dados de clientes.")
        }
      } catch (err) {
        console.error("Falha ao carregar os dados dos clientes:", err)
        setError("Falha ao carregar os dados dos clientes. Por favor, tente novamente mais tarde.")

        // Em caso de erro, tentar usar dados de exemplo
        try {
          setUsandoDadosExemplo(true)
          const { clientes: mockData } = await carregarDadosCompletos()
          setClientes(mockData)
          setFilteredClientes(mockData)
          setError(null)
        } catch (mockError) {
          console.error("Falha ao carregar dados de exemplo:", mockError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSearch = (searchTerm: string, searchType: "name" | "document") => {
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes)
      setCurrentPage(1)
      return
    }

    const term = searchTerm.toLowerCase().trim()
    const filtered = clientes.filter((cliente) => {
      if (searchType === "name") {
        return cliente.nome.toLowerCase().includes(term)
      } else {
        // Garantir que cpfCnpj seja uma string antes de usar replace
        const cpfCnpjNormalizado =
          typeof cliente.cpfCnpj === "string"
            ? cliente.cpfCnpj.replace(/[^\d]/g, "")
            : String(cliente.cpfCnpj || "").replace(/[^\d]/g, "")

        const termNormalizado = term.replace(/[^\d]/g, "")
        return cpfCnpjNormalizado.includes(termNormalizado)
      }
    })

    setFilteredClientes(filtered)
    setCurrentPage(1)
  }

  const handleClientSelect = (cliente: ClienteCompleto) => {
    setSelectedCliente(cliente)
  }

  const handleCloseDetails = () => {
    setSelectedCliente(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calcular paginação
  const indexOfLastClient = currentPage * clientesPerPage
  const indexOfFirstClient = indexOfLastClient - clientesPerPage
  const currentClientes = filteredClientes.slice(indexOfFirstClient, indexOfLastClient)
  const totalPages = Math.ceil(filteredClientes.length / clientesPerPage)

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col">
        <BanestesHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-banestes-blue" />
          <span className="ml-2">Carregando dados dos clientes...</span>
        </div>
      </div>
    )
  }

  if (error && clientes.length === 0) {
    return (
      <div className="flex h-screen flex-col">
        <BanestesHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <AlertCircle className="mb-2 h-5 w-5" />
            <p className="font-medium">{error}</p>
            <button
              className="mt-4 rounded bg-banestes-blue px-4 py-2 text-white hover:bg-banestes-lightBlue"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <BanestesHeader />

      <div className="container mx-auto flex-1 px-4 py-8">
        {usandoDadosExemplo && (
          <Alert className="mb-6 border-banestes-green bg-white" variant="default">
            <Info className="h-4 w-4 text-banestes-green" />
            <AlertTitle>Usando dados de exemplo</AlertTitle>
            <AlertDescription>
              Não foi possível conectar à fonte de dados original. Exibindo dados de exemplo para demonstração.
            </AlertDescription>
          </Alert>
        )}

        <SearchFilters onSearch={handleSearch} />

        <div className="mt-6">
          <ClientList clients={currentClientes} onClientSelect={handleClientSelect} />

          {filteredClientes.length > 0 ? (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          ) : (
            <p className="mt-4 text-center text-gray-500">Nenhum cliente encontrado com os critérios de busca.</p>
          )}
        </div>

        {selectedCliente && <ClientDetails client={selectedCliente} onClose={handleCloseDetails} />}
      </div>

      <footer className="banestes-gradient py-4 text-center text-white">
        <div className="container mx-auto">
          <p className="text-sm">© Banestes {new Date().getFullYear()}.</p>
          <p className="mt-1 text-xs opacity-80">Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}
