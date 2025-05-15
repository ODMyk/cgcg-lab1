# 📦 Convex Hull and Largest Triangle

This project implements the Graham algorithm for finding the convex hull and custom algorithm of finding the largest triangle on this convex hull. The application is built using the following stack:

- ⚙️ **Tauri**: For creating a lightweight desktop application
- ⚛️ **React**: For building the user interface
- 🔄 **Redux-Saga**: For managing side effects and asynchronous logic
- 🟦 **TypeScript**: For robust and type-safe development

## 🚀 Features

- Interactive canvas input UI
- Random input
- Import/export input points
- Export result

## 📦 Installation

1. **Install dependencies**:

```bash
npm install # yarn install
```

2. **Run the development server**:

```bash
npm run tauri dev # yarn tauri dev
```

> Make sure you have Rust and Tauri prerequisites installed. Refer to the [Tauri docs](https://tauri.app/) for setup.

## 📁 Folder Structure

```
.
├── src/
│   ├── components/     # React components
│   ├── costants/       # Application constants
│   ├── store/          # Redux store and sagas
│   ├── services/       # Math logic (Graham scan, etc.)
│   ├── types/          # TypeScript types and interfaces
│   └── App.tsx         # Entry point
├── public/
├── src-tauri/          # Tauri backend
└── ReadMe.md           # This file
```

## 📜 License

MIT License
