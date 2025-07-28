# Real-Time Notes Backend

A NestJS API for a collaborative candidate-notes app with JWT auth, TypeORM/MySQL (Railway), Socket.io real-time messaging, `@username` tagging, notifications, and document upload.

## 🔗 Live Deployment (Frontend):
https://algohire-notes-frontend.vercel.app/login

## 🔑 Features

- **Authentication**: Signup, Login, JWT + Refresh Token  
- **Candidates CRUD**: Create & list candidates  
- **Notes**: Real-time notes per candidate via Socket.io  
- **@username Tagging**: Parses `@username`, stores tagged messages  
- **Notifications**: Emits `notify` events to mentioned users & `/notifications` endpoint  
- **Document Upload**: Upload & share documents in notes (Multer + NestJS)

## 🚀 Quickstart

### 1. Prerequisites

- Node.js v18+ & Yarn  
- A Railway MySQL database  
- (Optional) Git & GitHub account

### 2. Clone & Install

```bash
git clone https://github.com/<your-org>/realtime-notes-backend.git
cd realtime-notes-backend
yarn install
