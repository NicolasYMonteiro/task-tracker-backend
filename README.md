# Task API – User and Task Manager

> 📄 Leia esta documentação em [Português 🇧🇷](./README.ptBR.md)

A RESTful API built with a focus on performance, security, and clean architecture, using Node.js, Express, Prisma ORM, and MySQL. Includes JWT authentication, Zod validation, and a clean separation of concerns (Controller, Service, Repository).

---

## Technologies Used
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [Zod](https://zod.dev/)
- [JWT](https://jwt.io/)
- [Docker](https://www.docker.com/) (optional, for database setup)

---

## ⚙️ Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/NicolasYMonteiro/task-manager-backend.git
cd task-manager-backend
```

### 2. Install dependencies
```bash
npm install
```
### 3. Set up MySQL using Docker (you can edit the credentials and use them in your .env file)
```bash
docker run --name mysql-task -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=taskdb -p 3306:3306 -d mysql
```

### 4. Create a .env file
Configure your environment variables (e.g., DATABASE_URL, JWT_SECRET, etc.)

### 5. Run Prisma migrations and generate the client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Start the development server
```bash
npm run dev
```

---

## Available Endpoints

### Auth
- `POST /user/register` → Create a new user  
- `POST /user/login` → Authenticate user and return JWT

> The routes below require a valid JWT token in the header:
> `Authorization: Bearer <token>`

### User
- `GET /user/:id` → Get user details
- `PUT /user/:id` → Update user information 
- `DELETE /user/:id` → Delete user

### Tasks
- `GET /tasks` → List tasks for the authenticated user 
- `GET /tasks/:id` →  Get task details  
- `POST /tasks` → Create a new task
- `PUT /tasks/:id` → Update a task
- `DELETE /tasks/:id` →  Delete a task

## Project Structure
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

## Project Conventions & Practices
1. Clean Code principles (well-separated layers
2. Zod for schema validation at the controller layer
3. Password hashing with Bcrypt
4. JWT-based authentication with expiration and validation
5. Prisma ORM with database relationships

## Author
Developed by Nícolas Yan Santos Monteiro

## 📄 License
This project is licensed under the MIT License.
Feel free to use, study, and adapt it.