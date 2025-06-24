````markdown
# Dynamic Role-Based Authentication and Authorization Module

A full-stack MEAN application (MongoDB, Express.js, Angular, Node.js) implementing dynamic role-based authentication and authorization.

---

## 🚀 Features

- User registration and login with JWT authentication
- Dynamic, role-based authorization (Admin, Editor, Viewer)
- Admin user management
- Editor content management
- Viewer read-only access
- Clean, modular project structure for scalability

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DarboeDev/midterm-assignment.git
cd midterm-assignment
```
````

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content:

```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/midterm-assignment
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
```

Start the backend server:

```bash
npm start
```

Backend will run at: [http://localhost:5000](http://localhost:5000)

---

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend will run at: [http://localhost:4200](http://localhost:4200)

---

## 🎯 Demo Credentials

You can register new users or use these demo credentials:

| Role   | Email              | Password  |
| ------ | ------------------ | --------- |
| Admin  | admin@example.com  | admin123  |
| Editor | editor@example.com | editor123 |
| Viewer | viewer@example.com | viewer123 |

---

## 🗂️ Project Structure

<details>
<summary><strong>Backend (Node.js/Express)</strong></summary>

```
backend/
├── models/
│   └── Users.js             # User schema with roles
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── userRoutes.js        # User management endpoints
├── middleware/
│   └── authMiddleware.js    # JWT & role-based middleware
└── server.js                # Express server setup
```

</details>

### Frontend Structure

```
frontend/src/app/
├── components/
│   ├── auth/                # Login/Register component
│   ├── dashboard/           # Main dashboard
│   ├── admin-panel/         # Admin user management
│   ├── editor-panel/        # Editor content management
│   └── viewer-panel/        # Viewer read-only content
├── guards/
│   ├── auth.guard.ts        # Authentication guard
│   └── role.guard.ts        # Role-based route guard
├── services/
│   └── auth.service.ts      # Authentication service
└── app.routes.ts            # Route configuration
```

</details>

---

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login

### User Management (Admin only)

- `GET /api/users` — Get all users
- `PUT /api/users/:id/role` — Update user role

---

## 📦 Tech Stack

- **MongoDB** — Database
- **Express.js** — Backend framework
- **Angular** — Frontend framework
- **Node.js** — Server runtime

---

## 📄 License

MIT License

---

```

```
