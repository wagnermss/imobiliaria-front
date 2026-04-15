# 🏢 Frontend: Gerenciamento de Imóveis (Angular)

Bem-vindo ao repositório do **Frontend de Gerenciamento de Imóveis**! Este projeto é uma Single Page Application (SPA) desenvolvida em **Angular** para apresentar e gerenciar a interface de usuário do nosso sistema de imóveis. 

Este projeto se comunica diretamente com a nossa API RESTful (Spring Boot), enviando e recebendo dados dos imóveis.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias e ferramentas:

* **Angular** (v21.2) - Framework principal para construção da interface.
* **TypeScript** - Superconjunto de JavaScript que adiciona tipagem estática.
* **RxJS** - Utilizado para programação reativa e chamadas assíncronas (HTTP).
* **NPM** - Gerenciador de pacotes do Node.js.

---

## ⚙️ Pré-requisitos

Para rodar este projeto na sua máquina, você vai precisar instalar:

1. **Node.js** (recomenda-se a versão LTS mais recente).
2. **NPM** (normalmente já vem incluído com a instalação do Node.js).
3. *(Opcional)* **Angular CLI**: Você pode instalar globalmente através do comando `npm install -g @angular/cli`.

---

## 🚀 Como Executar o Projeto Localmente

Siga estes passos para iniciar a aplicação no seu navegador:

### 1. Clonar e acessar a pasta do projeto
Abra o terminal e navegue até a pasta raiz do projeto (onde se encontra o arquivo `package.json`).

### 2. Instalar as dependências
Antes de rodar o projeto pela primeira vez, você precisa baixar todas as bibliotecas necessárias. Execute o comando:
> npm install

### 3. Iniciar o servidor de desenvolvimento
Após a instalação, você pode iniciar a aplicação executando:
> npm start

*(Este comando vai executar o `ng serve` em segundo plano).*

### 4. Abrir no Navegador
Abra o seu navegador favorito e acesse:
**http://localhost:4200/**

⚠️ **Atenção:** Para que o sistema funcione totalmente (como salvar ou listar novos imóveis), garanta que o seu projeto **Backend (Spring Boot)** está rodando simultaneamente na porta `8080`! O serviço do Angular está configurado para fazer chamadas para `http://localhost:8080/api/imoveis`.

---

## 🤝 Estrutura do Código e Componentes

A organização principal do código fica dentro da pasta `src/app/`, dividida nas seguintes responsabilidades:

* **`models/`**: Contém as interfaces (ex: `imovel.ts`) que refletem os dados vindos do backend.
* **`services/`**: Contém a lógica de comunicação com a API (`imovel.service.ts`).
* **`components/`**: Onde ficam as telas da nossa aplicação:
  * **`cadastro-imovel`**: Formulário responsável por coletar os dados e criar um novo imóvel no sistema.
  * **`lista-imoveis`**: Tabela/Lista responsável por consultar a API e exibir todos os imóveis já cadastrados.
