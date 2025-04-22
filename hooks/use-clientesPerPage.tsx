import { useEffect, useState } from "react"

export function useClientesPerPage() {
  const [clientesPorPagina, setClientesPerPage] = useState(10)

  useEffect(() => {
    function updateClientesPerPage() {
      const width = window.innerWidth
      if (width < 640) {
        setClientesPerPage(4) // Telas pequenas (celular)
      } else if (width < 1024) {
        setClientesPerPage(6) // Telas médias (tablet)
      } else if (width > 1024){
        setClientesPerPage(9) // Telas grandes (desktop)
      }
    }

    updateClientesPerPage()
    window.addEventListener("resize", updateClientesPerPage)

    return () => window.removeEventListener("resize", updateClientesPerPage)
  }, [])

  return clientesPorPagina
}