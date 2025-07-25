# Mini Digital Product Marketplace

A modern, educational-themed web app for sharing and downloading digital products (templates, cheat sheets, guides) built with Node.js, Express, MongoDB, and EJS.

## Tech Stack
- Node.js
- Express
- EJS (views)
- MongoDB (Mongoose)
- Multer (file uploads)
- express-session, connect-mongo, express-flash
- Plain CSS (no frameworks)

## Setup Instructions
```bash
git clone <your-repo-url>
cd <project-folder>
npm install
npm start
```

Or for auto-reload during development (optional):
```bash
npm run dev
```

## .env Example
```
MONGODB_URI=mongodb://localhost:27017/marketplace
SESSION_SECRET=some_secure_string
PORT=3000
```

## Features
- User login/signup
- Product upload (PDF, DOCX, ZIP, max 10MB, with category)
- Product listing with category filter and pagination
- Download after login
- Flash messages for feedback
- Simple, modern UI for browsing and downloading resources

## Screenshots

### Home Page
![Home Page](screenshots/homepage.png)

### Product List
![Product List](screenshots/products.png)

### Upload Form
![Upload Form](screenshots/upload.png)

### Login/Signup Page
![Login/Signup](screenshots/login.png)

---
For students, creators, and educators. Enjoy! 