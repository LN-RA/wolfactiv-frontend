# Wolfactiv - Niche Perfume Discovery Platform

## Overview

Wolfactiv is a niche perfume discovery platform that helps users find their perfect fragrance through a personalized quiz experience. The application features a conversational quiz that determines users' olfactory profiles, presents curated perfume recommendations, and offers the ability to purchase sample sets. The platform is built with a modern full-stack architecture using React, Express, and PostgreSQL.

## Recent Changes

### Database Integration (January 2025)
- Migrated from in-memory storage to PostgreSQL database for production data persistence
- Added sessions table for database-backed authentication
- Updated storage layer to use Drizzle ORM with proper database operations
- Enhanced schema with relations between users, quiz results, and sample orders

### Design System Update (January 2025)
- Switched to elegant light theme with cream/white backgrounds
- Updated quiz structure with comprehensive personality assessment questions
- Enhanced user interface with improved visual hierarchy and smooth animations
- Redesigned navbar and home page for better user experience

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite for development and build tooling
- **Backend**: Express.js with TypeScript for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Authentication**: Custom JWT-less session-based authentication
- **Payments**: Stripe integration for sample set purchases
- **External API**: Integration with external Flask backend for quiz processing

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js for radar chart visualizations
- **Styling**: Custom CSS variables for theming with dark mode support

### Backend Architecture
- **API Routes**: RESTful endpoints for authentication, quiz results, and sample orders
- **Storage Layer**: PostgreSQL database with Drizzle ORM for production data persistence
- **Payment Processing**: Stripe integration for handling sample set purchases
- **Session Management**: Express sessions with PostgreSQL session store

### Database Schema
- **Sessions**: Session storage table for authentication persistence
- **Users**: Basic user information (email, password, names)  
- **Quiz Results**: Stores olfactory profiles with JSON data for parfums and radar charts
- **Sample Orders**: Tracks purchase history and order status with Stripe integration

## Data Flow

1. **Quiz Flow**: User completes conversational quiz → Data sent to external Flask API → Results processed and stored locally
2. **Authentication Flow**: User registration/login → Session-based authentication → User data persisted
3. **Purchase Flow**: User selects sample set → Stripe payment processing → Order tracking
4. **Profile Management**: Users can view quiz history and order status

## External Dependencies

### Core Dependencies
- **Drizzle ORM**: Database queries and migrations with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **Stripe**: Payment processing (@stripe/stripe-js, @stripe/react-stripe-js)
- **External Quiz API**: Flask backend hosted on Render (https://wolfactiv-backend.onrender.com)

### UI and Styling
- **Radix UI**: Comprehensive component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Chart.js**: Data visualization for olfactory profile radar charts

### Development Tools
- **Vite**: Fast development server and build tool with React plugin
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for server-side code

## Deployment Strategy

The application is designed for deployment on platforms like Replit or Netlify:

- **Development**: Uses Vite dev server with Express backend middleware
- **Production**: Static frontend build served by Express with API routes
- **Database**: Uses environment variable DATABASE_URL for PostgreSQL connection
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `STRIPE_SECRET_KEY`: Stripe payment processing
  - `VITE_STRIPE_PUBLIC_KEY`: Stripe frontend integration

The build process creates optimized bundles for both frontend (static assets) and backend (Node.js server), making it suitable for various hosting platforms that support full-stack applications.