import * as React from "react"

// Define o breakpoint a partir do qual consideramos o dispositivo como "mobile"
const MOBILE_BREAKPOINT = 768

// Hook personalizado que detecta se o usuário está em um dispositivo mobile
export function useIsMobile() {
  // Cria um estado para armazenar se é mobile ou não
  // Inicializa como undefined para evitar decisões prematuras no SSR
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Cria uma MediaQueryList baseada no breakpoint definido
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Função chamada sempre que a largura da tela mudar em relação à media query
    const onChange = () => {
      // Atualiza o estado se a largura da janela for menor que o breakpoint
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Adiciona o listener para detectar mudanças no tamanho da janela
    mql.addEventListener("change", onChange)

    // Executa imediatamente para setar o estado inicial ao montar o componente
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Remove o listener ao desmontar o componente
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Garante que o retorno seja um booleano (mesmo se isMobile for undefined no início)
  return !!isMobile
}
