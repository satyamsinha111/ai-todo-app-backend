# AI-Powered Todo App Backend

A well-structured TypeScript Node.js backend with comprehensive user authentication system, built with scalability and maintainability in mind.

## 🚀 Features

- **User Authentication**: Complete signup, login, and logout functionality
- **Email Verification**: Secure email verification with Nodemailer
- **JWT Authentication**: Access and refresh token support
- **Password Security**: Bcrypt password hashing
- **MongoDB Integration**: Robust database operations with Mongoose
- **Type Safety**: Full TypeScript implementation with strict typing
- **Input Validation**: Zod schema validation for all requests
- **Error Handling**: Centralized error handling with custom error classes
- **Security**: Helmet, CORS, rate limiting, and other security measures
- **Modular Architecture**: Clean separation of concerns with services, controllers, and routes

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-powered-todo-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/ai-todo-app

   # JWT Configuration
   JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com

   # Application Configuration
   APP_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:3001
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📚 API Documentation

### Interactive API Documentation

The API includes comprehensive interactive documentation powered by Swagger/OpenAPI:

- **Swagger UI**: Visit `http://localhost:3000/api-docs` for interactive API documentation
- **OpenAPI JSON**: Get the raw OpenAPI specification at `http://localhost:3000/api-docs.json`

The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Try-it-out functionality for testing endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 900
    }
  }
}
```

#### Verify Email
```http
GET /api/auth/verify-email?token=verification_token
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer jwt_access_token
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

#### Logout All Devices (Protected)
```http
POST /api/auth/logout-all
Authorization: Bearer jwt_access_token
```

#### Resend Verification Email
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Health Check
```http
GET /health
```

## 🏗️ Project Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── database/         # Database connection and models
├── middlewares/      # Express middlewares
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── app.ts           # Express application setup
└── index.ts         # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ai-todo-app` |
| `JWT_ACCESS_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | Required |
| `EMAIL_PASS` | SMTP password | Required |
| `EMAIL_FROM` | From email address | Required |

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds of 12
- **JWT Tokens**: Separate access and refresh tokens
- **Rate Limiting**: Configurable rate limiting per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **Error Handling**: Secure error responses

## 🧪 Testing

The project includes Jest configuration for testing:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all required environment variables are set in production:
- `NODE_ENV=production`
- `JWT_ACCESS_SECRET` (strong secret)
- `JWT_REFRESH_SECRET` (strong secret)
- `EMAIL_*` variables for email functionality
- `MONGODB_URI` for database connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
