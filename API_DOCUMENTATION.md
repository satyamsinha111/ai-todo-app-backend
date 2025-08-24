# API Documentation Guide

## 📚 Swagger/OpenAPI Integration

This project includes comprehensive API documentation powered by Swagger/OpenAPI 3.0, providing an interactive interface for exploring and testing the API endpoints.

## 🚀 Accessing the Documentation

### Development Environment
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

### Production Environment
- **Swagger UI**: `https://your-domain.com/api-docs`
- **OpenAPI JSON**: `https://your-domain.com/api-docs.json`

## 🎯 Features

### Interactive Documentation
- **Try-it-out functionality**: Test endpoints directly from the browser
- **Request/Response examples**: Pre-filled examples for all endpoints
- **Authentication support**: Built-in JWT token testing
- **Schema validation**: Real-time validation of request bodies
- **Response visualization**: Formatted JSON responses

### Comprehensive Coverage
- **All endpoints documented**: Complete coverage of authentication API
- **Request schemas**: Detailed input validation rules
- **Response schemas**: Complete response structure documentation
- **Error responses**: All possible error scenarios documented
- **Authentication requirements**: Clear indication of protected endpoints

## 📋 API Endpoints Documentation

### Authentication Endpoints

#### 1. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Description**: Create a new user account with email verification
- **Authentication**: Not required
- **Request Body**: User registration data (email, password, firstName, lastName)
- **Response**: User data with verification status

#### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and return access/refresh tokens
- **Authentication**: Not required
- **Request Body**: Login credentials (email, password)
- **Response**: User data and JWT tokens

#### 3. Email Verification
- **Endpoint**: `GET /api/auth/verify-email`
- **Description**: Verify user email address using verification token
- **Authentication**: Not required
- **Query Parameters**: token (verification token)
- **Response**: Updated user data with verification status

#### 4. Resend Verification Email
- **Endpoint**: `POST /api/auth/resend-verification`
- **Description**: Resend email verification link to user
- **Authentication**: Not required
- **Request Body**: Email address
- **Response**: Success confirmation

#### 5. Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Description**: Get new access token using refresh token
- **Authentication**: Not required
- **Request Body**: Refresh token
- **Response**: New access and refresh tokens

#### 6. Logout (Single Device)
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Invalidate refresh token for current device
- **Authentication**: Required (Bearer token)
- **Request Body**: Refresh token to invalidate
- **Response**: Success confirmation

#### 7. Logout (All Devices)
- **Endpoint**: `POST /api/auth/logout-all`
- **Description**: Invalidate all refresh tokens for the user
- **Authentication**: Required (Bearer token)
- **Response**: Success confirmation

#### 8. Get User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Description**: Retrieve current user profile information
- **Authentication**: Required (Bearer token)
- **Response**: User profile data

#### 9. Health Check
- **Endpoint**: `GET /api/auth/health`
- **Description**: Check if the authentication service is healthy
- **Authentication**: Not required
- **Response**: Service status information

## 🔐 Authentication

### JWT Token Authentication
The API uses JWT (JSON Web Tokens) for authentication:

- **Access Token**: Valid for 15 minutes, used for API requests
- **Refresh Token**: Valid for 7 days, used to get new access tokens
- **Bearer Token Format**: `Authorization: Bearer <access_token>`

### Using Authentication in Swagger UI
1. Click the "Authorize" button at the top of the Swagger UI
2. Enter your JWT access token in the format: `Bearer <your_token>`
3. Click "Authorize" to apply the token to all protected endpoints
4. You can now test protected endpoints directly from the UI

## 📊 Data Models

### User Model
```json
{
  "id": "string",
  "email": "string (email)",
  "firstName": "string",
  "lastName": "string",
  "isEmailVerified": "boolean",
  "createdAt": "string (date-time)"
}
```

### User Registration Request
```json
{
  "email": "string (email)",
  "password": "string (min 8 chars, complex)",
  "firstName": "string (max 50 chars)",
  "lastName": "string (max 50 chars)"
}
```

### User Login Request
```json
{
  "email": "string (email)",
  "password": "string"
}
```

### Tokens Response
```json
{
  "accessToken": "string (JWT)",
  "refreshToken": "string (JWT)",
  "expiresIn": "number (seconds)"
}
```

## 🚨 Error Responses

### Common Error Codes
- **400 Bad Request**: Validation errors, missing required fields
- **401 Unauthorized**: Invalid or missing authentication
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (e.g., email already registered)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side errors

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🛠️ Development

### Adding New Endpoints
To add documentation for new endpoints:

1. **Add Swagger comments** to your route files:
```typescript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Your endpoint summary
 *     description: Detailed description
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success response
 */
```

2. **Define schemas** in `src/config/swagger.ts` if needed
3. **Update the API paths** in the Swagger configuration

### Customizing Swagger UI
The Swagger UI can be customized in `src/app.ts`:

```typescript
this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Your API Documentation',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
  },
}));
```

## 🔧 Configuration

### Swagger Configuration
The Swagger configuration is located in `src/config/swagger.ts` and includes:

- **API Information**: Title, version, description, contact info
- **Server URLs**: Development and production server configurations
- **Security Schemes**: JWT Bearer token authentication
- **Data Schemas**: All request/response models
- **Response Templates**: Common error responses

### Environment Variables
The documentation automatically uses the correct server URLs based on your environment configuration.

## 📱 Integration Examples

### Frontend Integration
```javascript
// Fetch OpenAPI specification
const response = await fetch('/api-docs.json');
const openApiSpec = await response.json();

// Use with OpenAPI generators
// npm install @openapitools/openapi-generator-cli
```

### API Client Generation
The OpenAPI specification can be used to generate client libraries:

```bash
# Generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api-docs.json \
  -g typescript-fetch \
  -o ./generated-client
```

## 🎨 Customization

### Styling
Custom CSS can be added to the Swagger UI:

```typescript
customCss: `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 20px 0 }
  .swagger-ui .scheme-container { background: #f8f9fa }
`
```

### Branding
- **Custom Title**: Set `customSiteTitle`
- **Custom Favicon**: Set `customfavIcon`
- **Custom Logo**: Add logo via CSS or configuration

## 🔍 Testing with Swagger UI

### Step-by-Step Testing
1. **Start the server**: `npm run dev`
2. **Open Swagger UI**: Navigate to `http://localhost:3000/api-docs`
3. **Test registration**: Use the `/auth/register` endpoint
4. **Test login**: Use the `/auth/login` endpoint to get tokens
5. **Authorize**: Click "Authorize" and add your access token
6. **Test protected endpoints**: Try `/auth/profile` and other protected routes

### Best Practices
- **Use realistic data**: Use proper email formats and strong passwords
- **Test error scenarios**: Try invalid data to see error responses
- **Check response schemas**: Verify that responses match the documented schemas
- **Test authentication**: Ensure protected endpoints work with valid tokens

## 📈 Monitoring and Analytics

### Usage Tracking
The Swagger UI can be enhanced with analytics:

```typescript
// Add Google Analytics
swaggerOptions: {
  onComplete: () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'swagger_ui_loaded');
    }
  }
}
```

### Performance Monitoring
Monitor API documentation usage and performance through standard web analytics tools.

---

**The Swagger integration provides a professional, interactive API documentation experience that enhances developer experience and API adoption.**
