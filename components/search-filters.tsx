/**
 * Componente de filtros de busca
 *
 * Este componente permite:
 * - Buscar clientes por nome ou CPF/CNPJ
 * - Selecionar o tipo de busca
 * - Limpar o campo de busca
 * - Executar a busca ao pressionar Enter ou clicar no botão
 */
"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (searchTerm: string, searchType: "name" | "document") => void
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"name" | "document">("name")

  const handleSearch = () => {
    onSearch(searchTerm, searchType)
  }

  const handleClear = () => {
    setSearchTerm("")
    onSearch("", searchType)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-medium text-banestes-blue">Filtrar Clientes</h2>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder={searchType === "name" ? "Buscar por nome..." : "Buscar por CPF/CNPJ..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-gray-300 pr-8"
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Limpar</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-40">
          <Select value={searchType} onValueChange={(value) => setSearchType(value as "name" | "document")}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Tipo de busca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="document">CPF/CNPJ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} className="gap-2 bg-banestes-blue hover:bg-banestes-lightBlue">
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </Button>
      </div>
    </div>
  )
}
