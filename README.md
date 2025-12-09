# DrPlantes - Plant Management MVP

A full-stack application for managing houseplants with watering schedules, care information, and expert guidance.

## 🌱 Project Overview

DrPlantes helps users track their houseplant collections, access expert-curated care information, and manage watering schedules with notifications.

### Features

- **User Authentication**: Secure registration and login with role-based access (end users, experts, administrators)
- **Plant Registry**: Register and track personal houseplants with photos, location, and notes
- **Plant Care Information**: Expert-curated plant species database with care instructions and FAQs
- **Watering Schedules**: Set custom watering schedules with notification reminders
- **Cross-Platform**: React Native mobile app and React web application

## 🏗️ Architecture

This is a multi-platform project with three separate applications:

- **Backend**: NestJS + TypeScript + PostgreSQL REST API
- **Mobile**: React Native + Expo (iOS & Android)
- **Web**: React + Vite + TypeScript

## 📁 Project Structure

```
DrPlantes/
├── backend/      # NestJS API server
├── mobile/       # React Native + Expo mobile app
├── web/          # React + Vite web application
├── shared/       # Shared TypeScript types
└── specs/        # Feature specifications and planning docs
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DrPlantes
   ```

2. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run migration:run
   npm run start:dev
   ```

4. **Mobile Setup**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

5. **Web Setup**
   ```bash
   cd web
   npm install
   npm run dev
   ```

For detailed setup instructions, see [QuickStart Guide](./specs/001-plant-management-mvp/quickstart.md)

## 📚 Documentation

- [Specification](./specs/001-plant-management-mvp/spec.md) - Feature requirements and user stories
- [Implementation Plan](./specs/001-plant-management-mvp/plan.md) - Technical architecture and decisions
- [Data Model](./specs/001-plant-management-mvp/data-model.md) - Database schema and entities
- [API Contracts](./specs/001-plant-management-mvp/contracts/) - OpenAPI specifications
- [Tasks](./specs/001-plant-management-mvp/tasks.md) - Implementation task breakdown

## 🛠️ Technology Stack

### Backend
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL + TypeORM
- JWT Authentication
- Cloudinary (image storage)
- Expo Push Notifications

### Mobile
- React Native
- Expo SDK 49+
- React Navigation
- React Native Paper
- AsyncStorage (offline support)

### Web
- React 18
- Vite
- TypeScript
- React Router
- Material-UI or Tailwind CSS

## 🧪 Testing

```bash
# Backend tests
cd backend && npm run test

# Mobile tests
cd mobile && npm run test

# Web tests
cd web && npm run test
```

## 📝 Development Workflow

This project follows spec-driven development using [spec-kit](https://github.com/github/spec-kit):

1. Define specifications (`/speckit.specify`)
2. Create implementation plans (`/speckit.plan`)
3. Generate tasks (`/speckit.tasks`)
4. Implement features (`/speckit.implement`)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Follow conventional commit format (feat:, fix:, docs:)
3. Ensure all tests pass
4. Create a pull request linking to the specification

## 📄 License

[License information to be added]

## 👥 Team

[Team information to be added]

---

🌱 **Built with spec-driven development** using [GitHub Spec Kit](https://github.com/github/spec-kit)
