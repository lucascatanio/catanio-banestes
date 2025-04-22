/**
 * Componente de paginação
 *
 * Este componente é responsável por:
 * - Exibir controles de navegação entre páginas
 * - Mostrar o número atual e total de páginas
 * - Permitir navegar para páginas específicas
 * - Adaptar a exibição para diferentes quantidades de páginas
 */
"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Não renderizar paginação se houver apenas uma página
  if (totalPages <= 1) return null

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Gerar números de página para exibição
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Mostrar todas as páginas se o total for menor que o máximo a mostrar
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sempre mostrar a primeira página
      pages.push(1)

      // Calcular início e fim do intervalo de páginas
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar se estiver no início
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1)
      }

      // Ajustar se estiver no final
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxPagesToShow + 2)
      }

      // Adicionar reticências se necessário no início
      if (start > 2) {
        pages.push("...")
      }

      // Adicionar páginas do meio
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Adicionar reticências se necessário no final
      if (end < totalPages - 1) {
        pages.push("...")
      }

      // Sempre mostrar a última página
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-6 flex items-center justify-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="border-gray-300 text-banestes-blue hover:bg-gray-100 hover:text-banestes-blue"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`min-w-[2rem] ${
              currentPage === page
                ? "bg-banestes-blue text-white hover:bg-banestes-lightBlue"
                : "border-gray-300 text-banestes-blue hover:bg-gray-100 hover:text-banestes-blue"
            }`}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="border-gray-300 text-banestes-blue hover:bg-gray-100 hover:text-banestes-blue"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima página</span>
      </Button>
    </div>
  )
}
