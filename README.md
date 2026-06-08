#  GitVerse

![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express.js](https://img.shields.io/badge/Express.js-API-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-darkgreen)
![JWT](https://img.shields.io/badge/JWT-Authentication-red)

A full-stack distributed version control system featuring a custom Node.js CLI engine and a React-based cloud dashboard for repository visualization and commit tracking.

## 🌐 Live Demo

https://gitverse-rust.vercel.app

## 📂 Repository

https://github.com/AyushSahoo7336/GitVerse

---

## 📖 Overview

### Problem Statement

Traditional version control systems often lack integrated visual dashboards for tracking repository structures and commit histories. GitVerse bridges this gap by combining a custom local command-line interface (CLI) with a centralized cloud database and a responsive web dashboard.

### Why GitVerse?

The project was built to demonstrate full-stack systems engineering concepts, including:

* Local file system traversal and state tracking
* Custom command-line tooling
* JWT-based authentication
* RESTful API architecture
* Cloud synchronization
* Repository visualization

### Target Users

* Software Engineers
* Students learning version control concepts
* Developers wanting visual repository tracking
* Teams requiring centralized commit monitoring

---

## ✨ Features

### ⚡ Custom CLI Engine
* **Command-Line Interface:** Custom Node.js CLI for seamless repository management.
* **Lifecycle & Version Control Operations:**
  * `start`
  * `init`
  * `remote add`
  * `add`
  * `commit`
  * `push`
  * `pull`
  * `revert`
* **State Tracking:** Advanced local repository state tracking and synchronization.
* **Ignore Configurations:** Custom `.gitverseignore` support for excluding specific files and directories from staging and synchronization.

### 🔒 Secure Authentication

* User registration and login
* JWT-based authentication
* Protected repository access

### 📊 Repository Visualization & Community

* **Interactive React Dashboard:** Real-time visual tracking of repository trees and commit histories.
* **Contribution Heatmap:** A dynamic, algorithmic activity graph on the user profile that visually maps commit frequencies over time.
* **Public & Private Repositories:** Granular database-level access control allowing users to toggle repository visibility.
* **Explore Feed:** A centralized community dashboard displaying all public repositories across the GitVerse ecosystem.
* **Deep Commit Inspection:** Drill down into individual commits to explore historical file directories and view raw source code directly within the browser interface.

### ☁️ Cloud Synchronization

* Sync local project payloads to MongoDB Atlas
* Persistent commit history storage
* Centralized repository management

### 🌍 Environment-Aware Deployment

* Dynamic API routing
* Seamless development and production configuration
* Vercel + Render deployment architecture

### 🖼️ Media Management

* Cloudinary integration
* Profile image upload and storage

---

## 💻 Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Context API

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JSON Web Tokens (JWT)

### External Services

* Cloudinary

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 🏛️ Architecture

GitVerse follows a decoupled three-tier architecture.

### 1. CLI Layer

A custom Node.js CLI executes version control operations locally by:

* Reading project directories
* Parsing file structures
* Generating repository payloads
* Sending data to the backend API

### 2. API Layer

An Express.js backend handles:

* Authentication
* Repository management
* Commit processing
* Payload validation
* Database interactions

### 3. Data & Visualization Layer

MongoDB Atlas stores repository metadata and commit histories, while the React frontend provides a visual interface for exploring repositories and tracking changes.

---

## 🚀 Installation

### Prerequisites

* Node.js (v16 or higher)
* MongoDB Atlas
* Cloudinary Account
* Git

### Clone Repository

```bash
git clone https://github.com/AyushSahoo7336/GitVerse.git
cd GitVerse
```

### Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Environment Variables

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000
```

#### Backend (.env)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run Locally

#### Start Backend

```bash
cd backend
npm start
```

#### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 📖 Usage

### 🌐 Web Dashboard
1. **Sign up** for an account.
2. **Log in** using your credentials.
3. **Create or access** your repositories.
4. **Visualize** repository trees and commit histories.

| Action | Command |
| :--- | :--- |
| **Start the CLI** | `node index.js start` |
| **Initialize a Repository** | `node index.js init` |
| **Link a Remote Repository** | `node index.js remote add <repoId>` |
| **Stage Files** | `node index.js add <file>` |
| **Commit Changes** | `node index.js commit "Initial commit"` |
| **Push Changes to Cloud** | `node index.js push` |
| **Pull Latest Changes** | `node index.js pull` |
| **Revert to a Previous Commit** | `node index.js revert <commitID>` |
```

Refresh the dashboard to view synchronized repository updates.

---

## 🗂️ Folder Structure

```plaintext
GitVerse/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🛠️ Key Technical Highlights

### Custom Version Control CLI
Developed a Node.js command-line interface supporting repository initialization, remote repository linking, file staging, commit creation, push/pull synchronization, and commit rollback operations.

### Custom Ignore File System
Implemented `.gitverseignore` support to filter files and directories during staging and synchronization, preventing unnecessary or sensitive files from being tracked and improving repository cleanliness.

### Secure Authentication Architecture
Implemented JWT-based authentication and authorization workflows to protect repositories and API endpoints.

### Repository Visualization Dashboard
Built a React-based dashboard that visualizes repository structures and commit histories, providing a centralized interface for monitoring project evolution.

### Payload Parsing & Code Rendering
Engineered a deep-inspection UI capable of parsing complex JSON directory payloads from MongoDB, allowing users to drill down through historical commit trees and render raw file contents directly in the browser.

### Environment-Aware Deployment
Designed dynamic API routing and configuration management to support deployment across local, Vercel-hosted, and Render-hosted environments.

### Cross-Platform Reliability
Diagnosed and resolved Linux deployment issues related to file path and case-sensitivity mismatches, improving application stability across operating systems..

---

## 👨‍💻 Author

**Ayush Sahoo**

* GitHub: https://github.com/AyushSahoo7336
* LinkedIn: https://www.linkedin.com/in/ayush-sahoo-63515b186
