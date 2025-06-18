# Psychology Website Backend

A comprehensive NestJS backend API for Dr. Akanksha Agarwal's Psychology Website, featuring appointment booking, content management, contact forms, and admin functionality.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with admin/patient roles
- 📅 **Appointment Management** - Complete booking system with time slot management
- 📝 **Contact Form** - Message handling with status tracking
- 📚 **Blog Management** - Full CRUD for blog posts with publishing workflow
- 🏥 **Services Management** - Therapy services with detailed information
- 👥 **User Management** - Patient and admin user accounts
- 📊 **API Documentation** - Complete Swagger/OpenAPI documentation
- 🗄️ **PostgreSQL Database** - Robust data persistence with TypeORM

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd psychology-website-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL Database**
   ```sql
   CREATE DATABASE psychology_website;
   CREATE USER psychology_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE psychology_website TO psychology_user;
   ```

4. **Configure Environment Variables**
   
   Copy `.env` and update with your settings:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=psychology_user
   DB_PASSWORD=your_password
   DB_NAME=psychology_website

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h

   # Application Configuration
   PORT=13001
   NODE_ENV=development

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/:id` - Get appointment details
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (Admin only)
- `GET /api/services/:id` - Get service details
- `PATCH /api/services/:id` - Update service (Admin only)
- `DELETE /api/services/:id` - Delete service (Admin only)

### Contact Messages
- `GET /api/contact` - Get all messages (Admin only)
- `POST /api/contact` - Submit contact form
- `GET /api/contact/:id` - Get message details (Admin only)
- `PATCH /api/contact/:id/read` - Mark as read (Admin only)
- `PATCH /api/contact/:id/reply` - Reply to message (Admin only)

### Blog Posts
- `GET /api/blog` - Get all posts
- `GET /api/blog/published` - Get published posts
- `POST /api/blog` - Create post (Admin only)
- `GET /api/blog/:id` - Get post details
- `PATCH /api/blog/:id` - Update post (Admin only)
- `DELETE /api/blog/:id` - Delete post (Admin only)

## API Documentation

Access the interactive API documentation at:
```
http://localhost:13001/api/docs
```

## Database Schema

### Users
- Personal information (name, email, phone, age)
- Role-based access (admin/patient)
- Authentication credentials

### Appointments
- Date and time scheduling
- Patient and service linking
- Status tracking (pending/confirmed/cancelled/completed)
- Notes and reason for visit

### Services
- Service details and descriptions
- Duration and pricing
- Feature lists
- Active/inactive status

### Contact Messages
- Contact form submissions
- Status tracking (unread/read/replied/archived)
- Admin response capabilities

### Blog Posts
- Content management with rich text
- Publishing workflow (draft/published/archived)
- Categories and tags
- Featured images

## Default Data

The application seeds with:
- **Admin User**: `admin@psychology-website.com` / `admin123`
- **Services**: Individual, Couples, Family therapy, Initial consultation
- **Sample Blog Posts**: Mental health articles

## Development

```bash
# Run in development mode
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint
```

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use strong JWT secret
   - Configure production database
   - Set proper CORS origins

2. **Build and Run**
   ```bash
   npm run build
   npm run start:prod
   ```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Request rate limiting (recommended for production)

## Support

For support or questions, contact the development team or refer to the NestJS documentation.

## License

This project is private and proprietary.
# ecc_be
# PsyWeb-BE
# PsyWeb-BE
