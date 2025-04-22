/**
 * Componente de listagem de clientes
 *
 * Este componente é responsável por:
 * - Exibir a lista de clientes em formato de cards
 * - Mostrar informações resumidas de cada cliente
 * - Permitir a seleção de um cliente para visualizar detalhes
 * - Exibir mensagem quando não há clientes disponíveis
 */
"use client"

import type { ClienteCompleto } from "@/types"
import { formatCpfCnpj, formatCurrency } from "@/lib/formatters"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Building, CreditCard, Wallet } from "lucide-react"

interface ClientListProps {
  clients: ClienteCompleto[]
  onClientSelect: (client: ClienteCompleto) => void
}

export function ClientList({ clients, onClientSelect }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">Nenhum cliente disponível.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card
          key={client.id}
          className="banestes-card cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
          onClick={() => onClientSelect(client)}
        >
          <div className="bg-banestes-blue px-4 py-2 text-white">
            <h3 className="font-medium">{client.nome || "Nome não disponível"}</h3>
            {client.nomeSocial && <p className="text-sm opacity-90">Nome social: {client.nomeSocial}</p>}
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <User className="mr-2 h-4 w-4 text-banestes-blue" />
                <span>{formatCpfCnpj(client.cpfCnpj)}</span>
              </div>

              {client.email && (
                <div className="flex items-center text-sm text-gray-700">
                  <Mail className="mr-2 h-4 w-4 text-banestes-blue" />
                  <span>{client.email}</span>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-700">
                <Wallet className="mr-2 h-4 w-4 text-banestes-green" />
                <span>Patrimônio: {formatCurrency(client.patrimonio)}</span>
              </div>

              {client.agencia && (
                <div className="flex items-center text-sm text-gray-700">
                  <Building className="mr-2 h-4 w-4 text-banestes-blue" />
                  <span>Agência: {client.agencia.nome}</span>
                </div>
              )}

              {client.contas && client.contas.length > 0 && (
                <div className="flex items-center text-sm text-gray-700">
                  <CreditCard className="mr-2 h-4 w-4 text-banestes-blue" />
                  <span>{client.contas.length} conta(s)</span>
                </div>
              )}

              <div className="mt-2 text-right">
                <button
                  className="text-sm font-medium text-banestes-blue hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClientSelect(client)
                  }}
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
