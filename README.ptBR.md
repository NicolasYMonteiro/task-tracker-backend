# 🚀 TaskTracker Backend API

> 📄 Read this documentation in [English 🇺🇸](./README.md)

Uma API RESTful robusta e escalável construída com tecnologias modernas e melhores práticas. Este backend alimenta a aplicação TaskTracker, fornecendo gerenciamento seguro de usuários, organização de tarefas e análises de produtividade.

## 🏗️ Visão Geral da Arquitetura

Esta API segue os princípios da **Arquitetura Limpa** com separação clara de responsabilidades:

```
src/
├── server.ts              # Ponto de entrada da aplicação
├── app.ts                 # Configuração da aplicação Express
├── config/                # Arquivos de configuração
│   └── prisma.ts         # Conexão com o banco de dados
├── middlewares/           # Middleware personalizado
│   └── ensureAuth.ts     # Autenticação JWT
├── modules/              # Módulos de funcionalidades
│   ├── user/            # Gerenciamento de usuários
│   └── task/            # Gerenciamento de tarefas
└── utils/               # Funções utilitárias
    ├── hash.ts          # Hash de senhas
    ├── jwt.ts           # Gerenciamento de tokens JWT
    ├── queryUtils.ts    # Auxiliares de consulta ao banco
    └── types.ts         # Definições de tipos TypeScript
```

## 🛠️ Stack Tecnológica

### Tecnologias Principais
- **[Node.js](https://nodejs.org/)** - Ambiente de execução
- **[Express.js](https://expressjs.com/)** - Framework web
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipagem
- **[Prisma ORM](https://www.prisma.io/)** - Kit de ferramentas para banco de dados
- **[MySQL](https://www.mysql.com/)** - Banco de dados relacional

### Segurança e Validação
- **[JWT](https://jwt.io/)** - Tokens JSON Web para autenticação
- **[Bcrypt](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas
- **[Zod](https://zod.dev/)** - Validação de esquemas
- **[Helmet](https://helmetjs.github.io/)** - Cabeçalhos de segurança
- **[CORS](https://www.npmjs.com/package/cors)** - Compartilhamento de recursos entre origens

### Ferramentas de Desenvolvimento
- **[ts-node-dev](https://www.npmjs.com/package/ts-node-dev)** - Servidor de desenvolvimento
- **[Docker](https://www.docker.com/)** - Containerização (opcional)

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

### 1. Clone e Instale
```bash
git clone https://github.com/NicolasYMonteiro/task-manager-backend.git
cd task-manager-backend
npm install
```

### 2. Configuração do Ambiente
Crie um arquivo `.env` no diretório raiz:

```env
# Banco de Dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/taskdb"

# JWT
JWT_SECRET="sua-chave-secreta-jwt-aqui"

# Servidor
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Cookies
COOKIE_DOMAIN="localhost"
```

### 3. Configuração do Banco de Dados

#### Opção A: Usando Docker (Recomendado)
```bash
docker run --name mysql-task \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=taskdb \
  -p 3306:3306 \
  -d mysql:8.0
```

#### Opção B: MySQL Local
1. Instale o MySQL localmente
2. Crie um banco de dados chamado `taskdb`
3. Atualize a `DATABASE_URL` no seu arquivo `.env`

### 4. Migração do Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações do banco de dados
npx prisma migrate dev --name init

# (Opcional) Popular o banco de dados
npx prisma db seed
```

### 5. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

A API estará disponível em `http://localhost:3001`

## 📚 Documentação da API

### URL Base
```
http://localhost:3001
```

### Autenticação
A maioria dos endpoints requer autenticação via token JWT. Inclua o token no cabeçalho Authorization:

```
Authorization: Bearer <seu-token-jwt>
```

### Formato de Resposta
Todas as respostas seguem um formato consistente:

**Resposta de Sucesso:**
```json
{
  "data": { ... },
  "message": "Mensagem de sucesso"
}
```

**Resposta de Erro:**
```json
{
  "message": "Mensagem de erro",
  "details": ["Detalhes do erro de validação"]
}
```

## 🔐 Endpoints de Autenticação

### Registrar Usuário
```http
POST /user/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senhaSegura123"
}
```

**Resposta:**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Login do Usuário
```http
POST /user/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senhaSegura123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 👤 Gerenciamento de Usuários

### Obter Perfil do Usuário
```http
GET /user
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "taskStats": {
    "total": 25,
    "completed": 18,
    "pending": 5,
    "overdue": 2,
    "highPriority": 3,
    "averageCompletionTime": 2.5
  },
  "recentTasks": [...]
}
```

### Obter Análises de Produtividade
```http
GET /user/productivity
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "dailyTasks": [...],
  "weeklyData": [...],
  "priorityData": [...],
  "monthlyTrend": [...],
  "summary": {
    "totalTasks": 25,
    "completedTasks": 18,
    "completionRate": 72,
    "averageTasksPerDay": 1.2,
    "streak": 5
  }
}
```

### Atualizar Usuário
```http
PUT /user
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Atualizado",
  "email": "joao.atualizado@exemplo.com"
}
```

### Deletar Usuário
```http
DELETE /user
Authorization: Bearer <token>
```

## 📋 Gerenciamento de Tarefas

### Obter Todas as Tarefas
```http
GET /task/listAll?filter=hoje&order=asc
Authorization: Bearer <token>
```

**Parâmetros de Consulta:**
- `filter`: `hoje`, `semana`, `mes`, `concluidas`, `todas`
- `order`: `asc`, `desc`

### Obter Tarefa por ID
```http
GET /task/:id
Authorization: Bearer <token>
```

### Criar Tarefa
```http
POST /task/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Completar documentação do projeto",
  "description": "Escrever documentação abrangente da API",
  "date": "2024-01-15T10:00:00.000Z",
  "emergency": false
}
```

### Atualizar Tarefa
```http
PUT /task/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título da tarefa atualizado",
  "description": "Descrição atualizada",
  "date": "2024-01-16T10:00:00.000Z",
  "emergency": true
}
```

### Completar Tarefa
```http
PUT /task/complete/:id
Authorization: Bearer <token>
```

### Deletar Tarefa
```http
DELETE /task/:id
Authorization: Bearer <token>
```

## 🗄️ Esquema do Banco de Dados

### Tabela User
```sql
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  tasks     Task[]
}
```

### Tabela Task
```sql
model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  date        DateTime
  status      TaskStatus @default(PENDING)
  emergency   Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      Int
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Enum TaskStatus
```sql
enum TaskStatus {
  PENDING
  COMPLETED
}
```

## 🔒 Recursos de Segurança

### Autenticação e Autorização
- **Autenticação baseada em JWT** com expiração configurável
- **Hash de senhas** usando bcrypt com rounds de salt
- **Rotas protegidas** com validação de middleware
- **Cookies seguros** para armazenamento de tokens

### Validação de Dados
- **Validação de esquema Zod** para todos os dados de entrada
- **Manipulação type-safe** de requisições/respostas
- **Proteção contra injeção SQL** via Prisma ORM
- **Proteção XSS** com sanitização adequada de dados

### Cabeçalhos de Segurança
- **Helmet.js** para cabeçalhos de segurança
- **Configuração CORS** para requisições cross-origin
- **Rate limiting** (pode ser adicionado com express-rate-limit)

## 🧪 Testes

### Executando Testes
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Estrutura de Testes
```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
└── fixtures/       # Dados de teste
```

## 📊 Performance e Monitoramento

### Otimização do Banco de Dados
- **Pool de conexões** com Prisma
- **Otimização de consultas** com indexação adequada
- **Lazy loading** para dados relacionados
- **Paginação** para grandes conjuntos de dados

### Monitoramento (Opcional)
- **Endpoint de health check**: `GET /health`
- **Endpoint de métricas**: `GET /metrics`
- **Logging** com formato estruturado

## 🚀 Deploy

### Variáveis de Ambiente para Produção
```env
NODE_ENV="production"
DATABASE_URL="mysql://user:pass@host:port/db"
JWT_SECRET="chave-secreta-de-producao"
CORS_ORIGIN="https://seudominio.com"
COOKIE_DOMAIN="seudominio.com"
```

### Deploy com Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

### Build para Produção
```bash
npm run build
npm start
```

## 🤝 Contribuindo

### Fluxo de Desenvolvimento
1. Faça um fork do repositório
2. Crie uma branch de feature: `git checkout -b feature/funcionalidade-incrivel`
3. Commit das mudanças: `git commit -m 'Adiciona funcionalidade incrível'`
4. Push para a branch: `git push origin feature/funcionalidade-incrivel`
5. Abra um Pull Request

### Padrões de Código
- **ESLint** para linting de código
- **Prettier** para formatação de código
- **TypeScript** modo strict
- **Commits convencionais** para mensagens de commit

## 📝 Versionamento da API

Versão atual da API: **v1**

Estratégia de versionamento:
- **Versionamento por URL**: `/api/v1/endpoint`
- **Versionamento por cabeçalho**: `Accept: application/vnd.api+json;version=1`
- **Compatibilidade retroativa** mantida por pelo menos 2 versões

## 🐛 Tratamento de Erros

### Códigos de Status HTTP
- `200` - Sucesso
- `201` - Criado
- `400` - Requisição Inválida
- `401` - Não Autorizado
- `403` - Proibido
- `404` - Não Encontrado
- `422` - Erro de Validação
- `500` - Erro Interno do Servidor

### Formato de Resposta de Erro
```json
{
  "message": "Falha na validação",
  "details": [
    "Email é obrigatório",
    "Senha deve ter pelo menos 8 caracteres"
  ],
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📈 Análises e Insights

A API fornece análises abrangentes de produtividade:

### Rastreamento de Atividade Diária
- Taxas de conclusão de tarefas
- Métricas de produtividade diária
- Padrões de atividade ao longo do tempo

### Performance Semanal
- Taxas de conclusão semanal
- Tendências de eficiência
- Rastreamento de conquista de metas

### Tendências Mensais
- Tendências de produtividade de longo prazo
- Padrões sazonais
- Métricas de crescimento

### Análise de Prioridades
- Distribuição de prioridades de tarefas
- Taxas de conclusão de alta prioridade
- Insights baseados em prioridades

## 🔧 Configuração

### Configuração do Ambiente
```typescript
interface Config {
  port: number;
  database: {
    url: string;
    maxConnections: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string[];
    credentials: boolean;
  };
}
```

### Feature Flags
```typescript
interface FeatureFlags {
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableAdvancedFilters: boolean;
}
```

## 📞 Suporte

### Obtendo Ajuda
- **Documentação**: Consulte este README e comentários inline do código
- **Issues**: Abra uma issue no GitHub
- **Discussões**: Use GitHub Discussions para perguntas

### Problemas Comuns

**Problemas de Conexão com Banco de Dados:**
```bash
# Verificar serviço MySQL
sudo systemctl status mysql

# Testar conexão
mysql -u usuario -p -h localhost
```

**Problemas com Token JWT:**
- Certifique-se de que `JWT_SECRET` está definido no ambiente
- Verifique o tempo de expiração do token
- Verifique o formato do token no cabeçalho Authorization

**Problemas de CORS:**
- Atualize `CORS_ORIGIN` nas variáveis de ambiente
- Verifique se a URL do frontend corresponde à configuração CORS

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Nícolas Yan Santos Monteiro**
- GitHub: [@NicolasYMonteiro](https://github.com/NicolasYMonteiro)
- LinkedIn: [Nícolas Monteiro](https://linkedin.com/in/nicolas-monteiro)

---

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Notificações em tempo real com WebSockets
- [ ] Filtros avançados e busca de tarefas
- [ ] Funcionalidades de colaboração em equipe
- [ ] Suporte à API do aplicativo móvel
- [ ] Dashboard de análises avançadas
- [ ] Modelos de tarefas e automação
- [ ] Integração com ferramentas externas (Slack, Google Calendar)
- [ ] Sugestões de tarefas com IA

### Melhorias de Performance
- [ ] Camada de cache Redis
- [ ] Otimização de consultas ao banco de dados
- [ ] Integração CDN para assets estáticos
- [ ] Suporte a escalonamento horizontal

---

*Construído com ❤️ e tecnologias web modernas*