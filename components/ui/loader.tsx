/**
 * Componente de carregamento
 *
 * Este componente exibe um indicador de carregamento animado.
 * Utiliza o ícone Loader2 do Lucide React com animação de rotação.
 * Pode receber classes adicionais e outras propriedades de div.
 */
import type React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loader({ className, ...props }: LoaderProps) {
  return <Loader2 className={cn("animate-spin", className)} {...props} />
}
