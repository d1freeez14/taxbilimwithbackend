# TaxBilim - Learning Management System

A comprehensive Learning Management System (LMS) for tax education, built with Next.js frontend and Node.js backend, fully containerized with Docker.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **Course Catalog** - Browse and search courses
- **User Dashboard** - Track progress, enrollments, and certificates
- **Interactive Learning** - Video lessons, progress tracking
- **Authentication** - Secure login/register system
- **Responsive Design** - Works on all devices

### Backend (Node.js/Express)
- **RESTful API** - Complete CRUD operations
- **Authentication & Authorization** - JWT-based with role-based access
- **Database Management** - PostgreSQL with Prisma ORM
- **File Upload** - Support for course materials and videos
- **Progress Tracking** - Detailed learning analytics
- **Review System** - Course ratings and feedback
- **Certificate Generation** - Automated certificate creation

### Infrastructure
- **Docker Containerization** - Complete containerized setup
- **PostgreSQL Database** - Reliable data storage
- **Redis Caching** - Performance optimization
- **Health Checks** - Service monitoring
- **Environment Management** - Flexible configuration

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 13
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Authentication**: Clerk
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL
- **Caching**: Redis
- **Environment**: Node.js

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## 🚀 Quick Start

### Option 1: Full Stack with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taxBilim-main
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
npm install
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Course Management
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (TEACHER/ADMIN)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course (ADMIN)

### User Management
- `GET /api/enrollments/my` - Get user enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/progress/overview` - Get learning progress
- `GET /api/certificates/my` - Get user certificates

### Reviews & Ratings
- `GET /api/reviews/course/:courseId` - Get course reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:courseId` - Update review

## 👥 User Roles

- **STUDENT** - Enroll in courses, track progress, leave reviews
- **TEACHER** - Create and manage courses, modules, lessons
- **ADMIN** - Full system access and user management

## 🔐 Default Users

After running the seed script, you can use these default accounts:

- **Admin**: admin@taxbilim.com / admin123
- **Teacher**: teacher@taxbilim.com / teacher123
- **Student**: student@taxbilim.com / student123

## 🗄 Database Schema

The system includes comprehensive data models:
- **Users** - Authentication and profile management
- **Authors** - Course creators and instructors
- **Courses** - Main learning content with features
- **Modules** - Course sections and organization
- **Lessons** - Individual learning units
- **Enrollments** - User course registrations
- **Progress** - Learning completion tracking
- **Certificates** - Achievement documentation
- **Reviews** - User feedback and ratings
- **Favorites** - User course bookmarks

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Access database
docker exec -it taxbilim_postgres psql -U postgres -d taxbilim_db

# Run backend commands
docker exec -it taxbilim_backend npm run seed
docker exec -it taxbilim_backend npx prisma migrate deploy
```

## 🔧 Environment Configuration

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### Backend Environment Variables
```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/taxbilim_db
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
taxBilim-main/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utilities and configurations
│   └── types/            # TypeScript type definitions
├── backend/               # Backend API
│   ├── src/              # Backend source code
│   ├── prisma/           # Database schema and migrations
│   └── docker-compose.yml # Backend services
├── public/               # Static assets
├── docker-compose.yml    # Main application services
└── README.md            # This file
```

## 🧪 Testing

### Frontend Testing
```bash
npm run test
npm run test:coverage
```

### Backend Testing
```bash
cd backend
npm test
```

## 📦 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure strong `JWT_SECRET`
3. Set up proper database credentials
4. Configure SSL/TLS certificates
5. Set up proper CORS origins

### Deployment Options
- **Docker Swarm** - For container orchestration
- **Kubernetes** - For scalable deployments
- **Cloud Platforms** - AWS, Google Cloud, Azure
- **VPS** - Traditional server deployment

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-based Access Control** - User permission management
- **Input Validation** - Request data sanitization
- **Rate Limiting** - API abuse prevention
- **CORS Protection** - Cross-origin request security
- **Helmet Security** - HTTP header protection

## 📊 Performance Optimization

- **Database Indexing** - Optimized queries
- **Redis Caching** - Response time improvement
- **Image Optimization** - Next.js built-in optimization
- **Code Splitting** - Lazy loading for better UX
- **CDN Integration** - Static asset delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first styling
- All contributors and users of this project
