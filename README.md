# viso-time-tracker
# Viso Academy Test Task: Mini Time Tracker

## 📋 Overview
A full-stack time tracking application developed as a test assignment for Viso Academy. The application allows users to log their daily work activities, grouping entries by date and calculating daily totals. It features strict validation to ensure logged hours do not exceed 24 hours per calendar day.

## 🛠 Tech Stack

**Backend:**
* **NestJS** - For scalable server-side architecture.
* **SQLite** - Lightweight relational database.
* **Prisma ORM** - For type-safe database interactions.
* **Class-Validator** - For input validation.

**Frontend:**
* **Next.js 14** (App Router) - React framework.
* **TypeScript** - For type safety.
* **Tailwind CSS** - For modern, responsive styling.
* **Axios** - For HTTP requests.

## ✨ Key Features
* **Time Logging:** Create entries with date, project, hours, and description.
* **Grouped History:** Entries are visually grouped by date with calculated **Daily Totals**.
* **Statistics:** Displays Grand Total hours across all entries.
* **Validation:** * Prevents logging negative hours.
    * **Strict Logic:** Ensures the sum of hours for a specific date never exceeds **24 hours** (Frontend & Backend validation).
* **Responsive Design:** Modern dashboard interface optimized for different screen sizes.

## 🚀 How to Run

### Prerequisites
* Node.js (v18 or higher)
* npm

### 1. Setup Backend (Server)
Open a terminal and navigate to the server directory:

```bash
cd server
npm install

Initialize the SQLite database:
npx prisma migrate dev --name init

Start the development server:
npm run start:dev
The server will start at http://localhost:3000

2. Setup Frontend (Client)
Open a new terminal window and navigate to the client directory:

Bash

cd client
npm install
Start the application:

Bash

npm run dev
The client will start at http://localhost:3001 (or the next available port).

🏗 Project Structure
This project follows a monorepo-style structure:

├── client/          # Next.js Frontend application
│   ├── src/app/     # App Router pages and layout
│   └── ...
│
├── server/          # NestJS Backend application
│   ├── src/         # Source code (Modules, Controllers, Services)
│   ├── prisma/      # Database schema
│   └── ...

👤 Author
Developed by [Oleksandr Vlasiuk]
