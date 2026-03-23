# Hello World Wonder - Server

Express.js backend server for the Hello World Wonder idea management platform.

## Features

- **User Authentication**: JWT-based authentication with email verification
- **Idea Management**: CRUD operations for ideas with different types
- **Field & Task Management**: Structured project organization
- **AI Integration**: OpenAI-powered analysis and suggestions
- **Real-time Chat**: Socket.IO for AI assistant conversations
- **File Upload**: Multer-based file handling
- **Analytics**: Comprehensive progress tracking and insights
- **Personal Development**: Special "YOU" project tracking

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **AI**: OpenAI GPT-4
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: Express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   └── logger.js     # Winston logging setup
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js # Request validation
│   ├── models/          # Mongoose models
│   │   ├── User.js      # User model
│   │   ├── Idea.js      # Idea model
│   │   ├── Field.js     # Field model
│   │   ├── Task.js      # Task model
│   │   └── ChatMessage.js # Chat model
│   ├── routes/          # API routes
│   │   ├── auth.js      # Authentication routes
│   │   ├── users.js     # User management
│   │   ├── ideas.js     # Idea CRUD
│   │   ├── fields.js    # Field management
│   │   ├── tasks.js     # Task management
│   │   ├── chat.js      # AI chat
│   │   ├── upload.js    # File upload
│   │   └── analytics.js # Analytics & reports
│   ├── utils/           # Utility functions
│   │   ├── emailService.js # Email functionality
│   │   └── aiService.js # AI integration
│   └── server.js        # Main server file
├── uploads/             # File upload directory
├── logs/               # Log files
├── package.json        # Dependencies
├── env.example         # Environment variables template
└── README.md          # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hello-owrld-wonderr-main/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hello-world-wonder
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   # ... other variables
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   ```

5. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Ideas
- `GET /api/ideas` - Get user's ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/:id` - Get single idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/duplicate` - Duplicate idea
- `POST /api/ideas/:id/share` - Share idea
- `GET /api/ideas/shared/:token` - Get shared idea

### Fields
- `GET /api/fields/idea/:ideaId` - Get fields for idea
- `POST /api/fields` - Create new field
- `GET /api/fields/:id` - Get single field
- `PUT /api/fields/:id` - Update field
- `DELETE /api/fields/:id` - Delete field
- `PATCH /api/fields/:id/complete` - Mark field complete
- `PATCH /api/fields/:id/progress` - Update field progress

### Tasks
- `GET /api/tasks/field/:fieldId` - Get tasks for field
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task complete
- `POST /api/tasks/:id/time-entry` - Add time entry
- `POST /api/tasks/:id/comments` - Add comment

### Chat
- `GET /api/chat/idea/:ideaId` - Get chat messages
- `POST /api/chat/send` - Send message to AI
- `POST /api/chat/execute-action/:messageId/:actionId` - Execute AI action
- `GET /api/chat/usage-stats` - Get AI usage statistics

### Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:filename` - Delete file
- `GET /api/upload/:filename/info` - Get file info
- `GET /api/upload/:filename/download` - Download file

### Analytics
- `GET /api/analytics/overview` - Get user analytics overview
- `GET /api/analytics/idea/:id` - Get idea analytics
- `GET /api/analytics/productivity` - Get productivity analytics
- `GET /api/analytics/ai-usage` - Get AI usage analytics
- `GET /api/analytics/personal-development` - Get personal dev analytics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `HOST` | Server host | `localhost` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration | `7d` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `EMAIL_HOST` | SMTP host | Optional |
| `EMAIL_USERNAME` | SMTP username | Optional |
| `EMAIL_PASSWORD` | SMTP password | Optional |
| `CORS_ORIGIN` | CORS origin | `http://localhost:5173` |

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Database Models

#### User
- Basic profile information
- Personal development metrics
- Authentication data
- Preferences

#### Idea
- Title, description, type
- Status and progress tracking
- Collaboration features
- AI insights and analytics

#### Field
- Structured sections for ideas
- Progress tracking
- AI-generated content
- Customization options

#### Task
- Individual actionable items
- Time tracking
- Comments and attachments
- Dependencies

#### ChatMessage
- AI conversation history
- Context and actions
- Usage analytics

## Security Features

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Comprehensive request validation
- **Data Sanitization**: MongoDB injection protection
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **File Upload**: Secure file handling

## AI Integration

The server integrates with OpenAI's GPT-4 for:
- Idea analysis and validation
- Field and task suggestions
- Personal development guidance
- Real-time chat assistance
- Content generation

## Deployment

### Docker
```bash
# Build image
docker build -t hello-world-wonder-server .

# Run container
docker run -p 5000:5000 --env-file .env hello-world-wonder-server
```

### Environment Setup
1. Set up MongoDB (Atlas or local)
2. Configure environment variables
3. Set up OpenAI API key
4. Configure email service (optional)
5. Deploy to your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.