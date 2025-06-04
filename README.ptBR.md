# Task API - Gerenciador de Usuários e Tarefas

> 📄 Read this in [English 🇺🇸](./README.md)

API RESTful desenvolvida com foco em performance, segurança e boas práticas, utilizando **Node.js**, **Express**, **Prisma ORM** e **MySQL**. Possui autenticação com JWT, validação com Zod e separação por camadas (Controller, Service, Repository).

---

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [Zod](https://zod.dev/)
- [JWT](https://jwt.io/)
- [Docker](https://www.docker.com/) (para banco de dados) (opcional)

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/NicolasYMonteiro/task-manager-backend.git
cd task-manager-backend
```

### 2. Instale as dependências

```bash
npm install
```
### 3. Configure o banco MySQL com Docker (preencha os campos editáveis como quiser e coloque-os no arquivo .env)

```bash
docker run --name mysql-task -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=taskdb -p 3306:3306 -d mysql
```

### 4. Crie o arquivo .env

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

### 5. Rode as migrations e gere o client Prisma
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Inicie a aplicação
```bash
npm run dev
```

---

## Endpoints disponíveis

### Auth

- `POST /user/register` → Cria um novo usuário  
- `POST /user/login` → Autentica usuário e retorna JWT

> As rotas abaixo requerem token JWT no header:  
> `Authorization: Bearer <token>`

### Usuário

- `GET /user/:id` → Detalhes do usuário  
- `PUT /user/:id` → Atualiza usuário  
- `DELETE /user/:id` → Remove usuário  

### Tarefas

- `GET /tasks` → Lista tarefas do usuário logado  
- `GET /tasks/:id` → Detalha uma tarefa específica  
- `POST /tasks` → Cria nova tarefa  
- `PUT /tasks/:id` → Atualiza tarefa  
- `DELETE /tasks/:id` → Remove tarefa  

## Estrutura do Projeto

src/
├── server.ts
├── app.ts
├── config/
│   └── prisma.ts
├── utils/
│   ├── hash.ts
│   └── jwt.ts
├── middlewares/
│   └── ensureAuth.ts
├── modules/
│   ├── user/
│   └── task/

## Padrões seguidos

1. Clean Code (camadas bem definidas)
2. Validação com Zod no controller
3. Hash de senha com Bcrypt
4. JWT com expiração e verificação
5. Prisma com relacionamentos

## Autor

Desenvolvido por Nícolas Yan Santos Monteiro

## 📄 Licença

Este projeto está sob a licença MIT.  
Sinta-se à vontade para usar, estudar e adaptar.