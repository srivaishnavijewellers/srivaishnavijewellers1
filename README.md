# Sri Vaishnavi Jewellers Stock Management Portal

Standalone authentication module for the stock management web application.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios, React Hook Form, React Icons
- Backend: Node.js, Express, JWT, bcrypt, Nodemailer
- Database: MongoDB with Mongoose

## Project Structure

```text
backend/
frontend/
```

## Setup

1. Create `backend/.env` from `backend/.env.example`
2. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`
3. Start MongoDB and update `MONGO_URI`
4. Run the apps:
   - `cd backend && npm run dev`
   - `cd frontend && npm run dev`

## Default Super Admin

- Email: `srivaishnavijewellers1@gmail.com`
- Password: `123456`

Change the default password immediately after first login.

