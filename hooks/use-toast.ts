/**
 * Hook de gerenciamento de toasts
 * 
 * Este arquivo implementa um sistema de notificações toast usando um padrão
 * de gerenciamento de estado similar ao Redux, com um store centralizado
 * e listeners para atualizações.
 */
"use client"

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Configurações globais
const TOAST_LIMIT = 1                // Número máximo de toasts exibidos simultaneamente
const TOAST_REMOVE_DELAY = 1000000   // Tempo em ms para remover o toast do DOM após ser fechado

/**
 * estrutura toast
 */
type ToasterToast = ToastProps & {
  id: string                      // Identificador único do toast
  title?: React.ReactNode         // Título opcional do toast
  description?: React.ReactNode   // Descrição opcional do toast
  action?: ToastActionElement     // Elemento de ação opcional (botões, links, etc.)
}

/**
 * Tipos de ações que podem ser despachadas para o reducer
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",           // Adicionar um novo toast
  UPDATE_TOAST: "UPDATE_TOAST",     // Atualizar um toast existente
  DISMISS_TOAST: "DISMISS_TOAST",   // Iniciar o processo de fechamento de um toast
  REMOVE_TOAST: "REMOVE_TOAST",     // Remover um toast da lista
} as const

// Contador para gerar IDs únicos para os toasts
let count = 0

/**
 * Gera um ID único para cada toast
 * Usa um contador incremental que reinicia quando atinge o valor máximo seguro
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

/**
 * Define os tipos de ações que podem ser despachadas
 * Cada ação tem um tipo específico e dados associados
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

/**
 * Interface que define a estrutura do estado global
 */
interface State {
  toasts: ToasterToast[]  // Lista de toasts ativos
}

/**
 * Mapa que armazena os timeouts para remoção de toasts
 * Chave: ID do toast, Valor: referência do timeout
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Adiciona um toast à fila de remoção
 * Configura um timeout para remover o toast após o atraso definido
 */
const addToRemoveQueue = (toastId: string) => {
  // Evita duplicar timeouts para o mesmo toast
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Configura um novo timeout para remover o toast
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  // Armazena a referência do timeout
  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer que processa as ações e atualiza o estado
 * Similar ao reducer do Redux, recebe o estado atual e uma ação,
 * e retorna o novo estado
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Adiciona um novo toast ao início da lista
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    // Atualiza um toast existente com novas propriedades
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    // Marca um ou todos os toasts como fechados
    case "DISMISS_TOAST": {
      const { toastId } = action

      // Efeito colateral: adiciona o(s) toast(s) à fila de remoção
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      // Atualiza o estado 'open' para false
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    
    // Remove um toast específico ou todos os toasts
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

/**
 * Lista de funções ouvintes que serão notificadas quando o estado mudar
 * Cada componente que usa o hook useToast registra uma função aqui
 */
const listeners: Array<(state: State) => void> = []

/**
 * Estado em memória que armazena a lista atual de toasts
 * Funciona como um "store" centralizado
 */
let memoryState: State = { toasts: [] }

/**
 * Função para despachar ações e atualizar o estado
 * Executa o reducer e notifica todos os ouvintes sobre a mudança
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * Tipo para criar um novo toast, omitindo o ID que será gerado automaticamente
 */
type Toast = Omit<ToasterToast, "id">

/**
 * Função principal para criar um novo toast
 * Retorna métodos para atualizar ou dispensar o toast criado
 */
function toast({ ...props }: Toast) {
  const id = genId()

  // Função para atualizar o toast
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  
  // Função para dispensar o toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Adiciona o novo toast ao estado
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Retorna o ID e métodos para manipular o toast
  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * Hook personalizado para acessar e manipular toasts
 * Permite que componentes em qualquer lugar da aplicação possam
 * criar, atualizar e dispensar toasts
 */
function useToast() {
  // Estado local que reflete o estado global
  const [state, setState] = React.useState<State>(memoryState)

  // Registra e remove o listener quando o componente monta/desmonta
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Retorna o estado atual e métodos para manipular toasts
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }