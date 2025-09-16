# 🚀 TaskTracker Backend API

> 📄 Leia esta documentação em [Português 🇧🇷](./README.ptBR.md)

A robust, scalable RESTful API built with modern technologies and best practices. This backend powers the TaskTracker application, providing secure user management, task organization, and productivity analytics.

## 🏗️ Architecture Overview

This API follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── server.ts              # Application entry point
├── app.ts                 # Express app configuration
├── config/                # Configuration files
│   └── prisma.ts         # Database connection
├── middlewares/           # Custom middleware
│   └── ensureAuth.ts     # JWT authentication
├── modules/              # Feature modules
│   ├── user/            # User management
│   └── task/            # Task management
└── utils/               # Utility functions
    ├── hash.ts          # Password hashing
    ├── jwt.ts           # JWT token management
    ├── queryUtils.ts    # Database query helpers
    └── types.ts         # TypeScript type definitions
```

## 🛠️ Tech Stack

### Core Technologies
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[Express.js](https://expressjs.com/)** - Web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Prisma ORM](https://www.prisma.io/)** - Database toolkit
- **[MySQL](https://www.mysql.com/)** - Relational database

### Security & Validation
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[Bcrypt](https://www.npmjs.com/package/bcryptjs)** - Password hashing
- **[Zod](https://zod.dev/)** - Schema validation
- **[Helmet](https://helmetjs.github.io/)** - Security headers
- **[CORS](https://www.npmjs.com/package/cors)** - Cross-origin resource sharing

### Development Tools
- **[ts-node-dev](https://www.npmjs.com/package/ts-node-dev)** - Development server
- **[Docker](https://www.docker.com/)** - Containerization (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### 1. Clone and Install
```bash
git clone https://github.com/NicolasYMonteiro/task-manager-backend.git
cd task-manager-backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/taskdb"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Server
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Cookies
COOKIE_DOMAIN="localhost"
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)
```bash
docker run --name mysql-task \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=taskdb \
  -p 3306:3306 \
  -d mysql:8.0
```

#### Option B: Local MySQL
1. Install MySQL locally
2. Create a database named `taskdb`
3. Update the `DATABASE_URL` in your `.env` file

### 4. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All responses follow a consistent format:

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "message": "Error message",
  "details": ["Validation error details"]
}
```

## 🔐 Authentication Endpoints

### Register User
```http
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Login User
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 👤 User Management

### Get User Profile
```http
GET /user
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
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

### Get Productivity Analytics
```http
GET /user/productivity
Authorization: Bearer <token>
```

**Response:**
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

### Update User
```http
PUT /user
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### Delete User
```http
DELETE /user
Authorization: Bearer <token>
```

## 📋 Task Management

### Get All Tasks
```http
GET /task/listAll?filter=today&order=asc
Authorization: Bearer <token>
```

**Query Parameters:**
- `filter`: `today`, `week`, `month`, `completed`, `all`
- `order`: `asc`, `desc`

### Get Task by ID
```http
GET /task/:id
Authorization: Bearer <token>
```

### Create Task
```http
POST /task/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "date": "2024-01-15T10:00:00.000Z",
  "emergency": false
}
```

### Update Task
```http
PUT /task/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "date": "2024-01-16T10:00:00.000Z",
  "emergency": true
}
```

### Complete Task
```http
PUT /task/complete/:id
Authorization: Bearer <token>
```

### Delete Task
```http
DELETE /task/:id
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### User Table
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

### Task Table
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

### TaskStatus Enum
```sql
enum TaskStatus {
  PENDING
  COMPLETED
}
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with configurable expiration
- **Password hashing** using bcrypt with salt rounds
- **Protected routes** with middleware validation
- **Secure cookies** for token storage

### Data Validation
- **Zod schema validation** for all input data
- **Type-safe** request/response handling
- **SQL injection protection** via Prisma ORM
- **XSS protection** with proper data sanitization

### Security Headers
- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **Rate limiting** (can be added with express-rate-limit)

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data
```

## 📊 Performance & Monitoring

### Database Optimization
- **Connection pooling** with Prisma
- **Query optimization** with proper indexing
- **Lazy loading** for related data
- **Pagination** for large datasets

### Monitoring (Optional)
- **Health check endpoint**: `GET /health`
- **Metrics endpoint**: `GET /metrics`
- **Logging** with structured format

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV="production"
DATABASE_URL="mysql://user:pass@host:port/db"
JWT_SECRET="production-secret-key"
CORS_ORIGIN="https://yourdomain.com"
COOKIE_DOMAIN="yourdomain.com"
```

### Docker Deployment
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

### Build for Production
```bash
npm run build
npm start
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** strict mode
- **Conventional commits** for commit messages

## 📝 API Versioning

Current API version: **v1**

Versioning strategy:
- **URL versioning**: `/api/v1/endpoint`
- **Header versioning**: `Accept: application/vnd.api+json;version=1`
- **Backward compatibility** maintained for at least 2 versions

## 🐛 Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Response Format
```json
{
  "message": "Validation failed",
  "details": [
    "Email is required",
    "Password must be at least 8 characters"
  ],
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📈 Analytics & Insights

The API provides comprehensive productivity analytics:

### Daily Activity Tracking
- Task completion rates
- Daily productivity metrics
- Activity patterns over time

### Weekly Performance
- Weekly completion rates
- Efficiency trends
- Goal achievement tracking

### Monthly Trends
- Long-term productivity trends
- Seasonal patterns
- Growth metrics

### Priority Analysis
- Task priority distribution
- High-priority completion rates
- Priority-based insights

## 🔧 Configuration

### Environment Configuration
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

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

### Common Issues

**Database Connection Issues:**
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection
mysql -u username -p -h localhost
```

**JWT Token Issues:**
- Ensure `JWT_SECRET` is set in environment
- Check token expiration time
- Verify token format in Authorization header

**CORS Issues:**
- Update `CORS_ORIGIN` in environment variables
- Check frontend URL matches CORS configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nícolas Yan Santos Monteiro**
- GitHub: [@NicolasYMonteiro](https://github.com/NicolasYMonteiro)
- LinkedIn: [Nícolas Monteiro](https://linkedin.com/in/nicolas-monteiro)

---

## 🎯 Roadmap

### Upcoming Features
- [ ] Real-time notifications with WebSockets
- [ ] Advanced task filtering and search
- [ ] Team collaboration features
- [ ] Mobile app API support
- [ ] Advanced analytics dashboard
- [ ] Task templates and automation
- [ ] Integration with external tools (Slack, Google Calendar)
- [ ] AI-powered task suggestions

### Performance Improvements
- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] CDN integration for static assets
- [ ] Horizontal scaling support

---

*Built with ❤️ and modern web technologies*