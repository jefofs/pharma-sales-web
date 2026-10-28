# 💊 Pharma Sales Manager - Web

> Aplicação web para gestão de visitas médicas e representantes farmacêuticos.
---

## 📌 Sobre o Projeto (Tema)

O **Pharma Sales Web** é a versão web desenvolvida a partir do pharma-sales-manager. O sistema foi projetado para otimizar a rotina de representantes da indústria farmacêutica, permitindo o agendamento, acompanhamento, edição e histórico de visitas a médicos.

A aplicação conta com suporte **Offline-First**: caso o representante perca a conexão com a internet ou o backend fique indisponível, os registros são armazenados localmente (`localStorage`) com um indicador de status e sincronizados automaticamente com o servidor assim que a conexão for restabelecida.

---

## 🚀 Tecnologias Utilizadas

### **Frontend (Web)**
* **Framework:** [Next.js]
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS v4
* **Comunicação HTTP:** Axios

### **Backend (API)**
* **Linguagem / Framework:** Java com [Spring Boot]
* **Arquitetura:** REST API (Porta 8080)
* **Persistência:** Spring Data JPA / Hibernate

### **Banco de Dados & Infraestrutura**
* **Banco de Dados:** PostgreSQL (Porta 5432)
* **Containerização:** Docker / Docker Compose

---

## ✨ Funcionalidades Principais

* **📋 Listagem de Visitas (RF01 / RF05):** Exibição de cards contendo nome/ID do médico, data/horário, observações e material apresentado.
* **🔍 Busca e Filtros Inteligentes (RF03):** Filtro em tempo real por nome do médico, ID ou observações, além de filtro por status (*AGENDADA*, *CONCLUIDA*, *CANCELADA*, *REAGENDADA*).
* **➕ Novo Agendamento:** Formulário para cadastrar novas visitas médicas.
* **✏️ Edição e Exclusão:** Atualização de status e detalhes de cada visita cadastrada.
* **🔄 Sincronização Offline-First:** Fila local de envio que sincroniza dados com o PostgreSQL no retorno da conexão.

---

## 💻 Como Executar o Projeto

### **Pré-requisitos**
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [Java JDK](https://www.oracle.com/java/technologies/downloads/) (versão 17 ou superior)
* [Docker](https://www.docker.com/) e Docker Compose instalados

---

### **1. Subir o Banco de Dados (PostgreSQL via Docker)**

No terminal, inicie o container do PostgreSQL:

```bash
docker run --name pharma_sales_postgres \
  -e POSTGRES_DB=pharma_sales \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:latest
```
### **2. Subir a API (Spring boot via docker) 
```bash
    cd pharma-sales-manager/api
    ./mvnw spring-boot:run
```
O backend estará rodando em http://localhost:8080

### **3. Subir o Frontend (Next.js) 
```bash
    cd pharma-sales-web
    npm install
    npm run dev
``` 
Abra o navegador e acesse: http://localhost:3000
