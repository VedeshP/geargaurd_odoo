# GearGuard Frontend Project Structure

## Overview
Modern React application with TypeScript, following feature-based architecture for scalability and maintainability.

## Directory Structure
```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons for PWA
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Input, Modal)
│   │   ├── layout/           # Layout components (Header, Sidebar, Footer)
│   │   └── common/           # Common business components
│   ├── features/             # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── dashboard/
│   │   ├── equipment/
│   │   ├── maintenance/
│   │   └── reports/
│   ├── hooks/                # Global custom hooks
│   ├── services/             # API services and utilities
│   ├── stores/               # State management (Zustand)
│   ├── types/                # Global TypeScript types
│   ├── utils/                # Helper functions
│   ├── constants/            # App constants
│   ├── styles/               # Global styles and Tailwind config
│   └── __tests__/            # Test utilities and global tests
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Key Architectural Decisions

### 1. Feature-Based Architecture
- Each feature is self-contained with its own components, hooks, services
- Promotes code reusability and maintainability
- Easier to scale team development

### 2. State Management Strategy
- **Zustand** for client-side state (UI state, user preferences)
- **React Query** for server state (API data, caching)
- **Context API** for theme and auth state

### 3. Component Design System
- Atomic design principles (atoms, molecules, organisms)
- Consistent design tokens via Tailwind CSS
- Accessible components following WCAG guidelines

### 4. Performance Optimization
- Route-based code splitting
- Component lazy loading
- Image optimization
- Bundle size monitoring

### 5. Testing Strategy
- Unit tests for utilities and hooks
- Component testing with React Testing Library
- E2E tests with Cypress for critical user flows
- Visual regression testing for UI components

## Development Workflow
1. **Feature Development**: Create feature branch from main
2. **Component First**: Build reusable components before features
3. **Test Driven**: Write tests alongside implementation
4. **Code Review**: Peer review before merge
5. **Continuous Integration**: Automated testing and deployment

## Code Standards
- **TypeScript**: Strict mode, explicit types
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Conventional Commits**: Structured commit messages