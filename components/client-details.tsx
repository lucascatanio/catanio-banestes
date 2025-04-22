/**
 * Componente de detalhes do cliente
 *
 * Este componente exibe informações detalhadas de um cliente selecionado:
 * - Informações pessoais
 * - Informações financeiras
 * - Detalhes das contas bancárias
 * - Informações da agência
 *
 * Organiza as informações em abas para melhor visualização.
 */
"use client"

import { useState } from "react"
import type { ClienteCompleto } from "@/types"
import { formatCpfCnpj, formatCurrency, formatDate, formatTipoConta, formatEstadoCivil } from "@/lib/formatters"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X, User, Mail, Building, CreditCard, Calendar, Wallet } from "lucide-react"

interface ClientDetailsProps {
  client: ClienteCompleto
  onClose: () => void
}

export function ClientDetails({ client, onClose }: ClientDetailsProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300) // Permitir que a animação seja concluída
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0 sm:max-w-[600px] md:max-w-[700px]">
        <DialogHeader className="banestes-gradient rounded-t-lg p-4 text-white">
          <DialogTitle className="text-xl font-bold">{client.nome || "Nome não disponível"}</DialogTitle>
          <DialogDescription className="text-white/90">{formatCpfCnpj(client.cpfCnpj)}</DialogDescription>
         
        </DialogHeader>

        <div className="p-4">
          <Tabs defaultValue="info" className="mt-2">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="info" className="data-[state=active]:bg-banestes-blue data-[state=active]:text-white">
                Informações
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="data-[state=active]:bg-banestes-blue data-[state=active]:text-white"
              >
                Financeiro
              </TabsTrigger>
              <TabsTrigger
                value="accounts"
                className="data-[state=active]:bg-banestes-blue data-[state=active]:text-white"
              >
                Contas
              </TabsTrigger>
            </TabsList>

            <div className="min-h-[400px]">
              <TabsContent value="info" className="mt-4">
                <div className="rounded-lg border bg-white p-4">
                  <h4 className="mb-4 text-center font-medium text-banestes-blue">Dados Pessoais</h4>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">Nome:</span>
                      </div>
                      <p className="pl-6">{client.nome || "Não cadastrado"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">Nome Social:</span>
                      </div>
                      <p className="pl-6">{client.nomeSocial || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">CPF/CNPJ:</span>
                      </div>
                      <p className="pl-6">{formatCpfCnpj(client.cpfCnpj) || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">RG:</span>
                      </div>
                      <p className="pl-6">{client.rg || "Não cadastrado"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">Data de Nascimento:</span>
                      </div>
                      <p className="pl-6">{formatDate(client.dataNascimento) || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">Estado Civil:</span>
                      </div>
                      <p className="pl-6">{formatEstadoCivil(client.estadoCivil) || "Não informado"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border bg-white p-4">
                  <h4 className="mb-4 text-center font-medium text-banestes-blue">Contato</h4>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                      </div>
                      <p className="pl-6">{client.email || "Não cadastrado"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-banestes-blue" />
                        <span className="text-sm font-medium text-gray-500">Endereço:</span>
                      </div>
                      <p className="pl-6">{client.endereco || "Não cadastrado"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="mt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 flex flex-col items-center justify-center">
                    <div className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4 text-banestes-green" />
                      <span className="text-sm font-medium">Renda Anual:</span>
                    </div>
                    <p className="text-lg font-semibold text-banestes-green">{formatCurrency(client.rendaAnual)}</p>
                  </div>

                  <div className="space-y-2 flex flex-col items-center justify-center">
                    <div className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4 text-banestes-green" />
                      <span className="text-sm font-medium">Patrimônio:</span>
                    </div>
                    <p className="text-lg font-semibold text-banestes-green">{formatCurrency(client.patrimonio)}</p>
                  </div>

                  <div className="col-span-2 mt-4 rounded-lg border bg-gray-50 p-4">
                    <h4 className="mb-2 font-medium text-banestes-blue">Agência</h4>
                    {client.agencia ? (
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Código</p>
                          <p>{client.agencia.codigo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Nome</p>
                          <p>{client.agencia.nome || "Não informado"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Endereço</p>
                          <p>{client.agencia.endereco || "Não informado"}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center">
                        <p className="text-gray-500">Cliente não está associado a nenhuma agência.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="accounts" className="mt-4">
                {client.contas && client.contas.length > 0 ? (
                  <div className="space-y-4">
                    {client.contas.map((conta, index) => (
                      <div key={conta.id || index} className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-banestes-blue" />
                          <h4 className="text-lg font-medium">{formatTipoConta(conta.tipo)}</h4>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium text-gray-500">ID da Conta</p>
                            <p>{conta.id || "Não informado"}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Saldo</p>
                            <p className="font-semibold text-banestes-green">{formatCurrency(conta.saldo)}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Limite de Crédito</p>
                            <p>{formatCurrency(conta.limiteCredito)}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Crédito Disponível</p>
                            <p>{formatCurrency(conta.creditoDisponivel)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <p className="py-4 text-gray-500">Nenhuma conta bancária cadastrada.</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button onClick={handleClose} className="bg-banestes-blue hover:bg-banestes-lightBlue">
              Fechar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
