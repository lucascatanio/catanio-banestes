# Lucas Catanio
# Sistema de Gerenciamento de Clientes - Banestes

## Descrição

Este projeto é um sistema de gerenciamento de clientes desenvolvido para o Banestes (Banco do Estado do Espírito Santo). A aplicação permite visualizar, buscar e gerenciar informações detalhadas de clientes, suas contas bancárias e agências associadas.

## Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento web
- **TypeScript**: Linguagem de programação tipada
- **Tailwind CSS**: Framework CSS para estilização
- **Shadcn/UI**: Componentes de interface reutilizáveis
- **Lucide React**: Biblioteca de ícones
- **React Hooks**: Para gerenciamento de estado

## Funcionalidades Principais

- **Listagem de Clientes**: Visualização de todos os clientes em formato de cards
- **Busca Avançada**: Filtro por nome ou CPF/CNPJ
- **Detalhes do Cliente**: Visualização detalhada das informações do cliente em abas organizadas:
  - **Informações Pessoais**: Nome, CPF/CNPJ, RG, data de nascimento, etc.
  - **Dados Financeiros**: Renda anual, patrimônio e agência associada
  - **Contas Bancárias**: Listagem de contas correntes e poupança com saldos e limites
- **Paginação**: Navegação entre páginas de resultados
- **Design Responsivo**: Interface adaptável para diferentes tamanhos de tela

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 18.x ou superior)
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucascatanio/catanio-banestes.git
   ```

2. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   # ou
   yarn install --legacy-peer-deps
   ```

3. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Acesse a aplicação em seu navegador:
   ```
   http://localhost:3000
   ```

## Dados

O sistema pode trabalhar com duas fontes de dados:

1. **Dados Reais**: Carregados de planilhas Google Sheets via API CSV
2. **Dados de Exemplo**: Utilizados como fallback quando não é possível acessar os dados reais

Os dados incluem:
- **Clientes**: Informações pessoais e financeiras
- **Contas**: Dados de contas bancárias (corrente e poupança)
- **Agências**: Informações sobre as agências do banco

## Personalização

O sistema utiliza as cores institucionais do Banestes:
- **Azul Banestes**: #003B71
- **Verde Banestes**: #00A859
- **Azul Claro**: #0066B3

Estas cores podem ser ajustadas no arquivo `tailwind.config.ts` conforme necessário.

## Solução de Problemas

### Conflitos de Dependências

Se encontrar problemas com conflitos de dependências durante a instalação, tente:

```bash
npm install --legacy-peer-deps
# ou
npm install --force
```

### Versão do React

O projeto foi desenvolvido para funcionar com React 18. Se estiver usando React 19, pode ser necessário fazer downgrade:

```bash
npm uninstall react react-dom
npm install react@18.2.0 react-dom@18.2.0
```

---

Desenvolvido com ❤️ para o Banestes - Banco do Estado do Espírito Santo