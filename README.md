# 🦁 Leo Summit Hack'26 - Project Setup Guide

This project consists of a **Frontend** (HTML/CSS/JS) and a **Backend** (Node.js) to handle registrations and PDF uploads.

## 🚀 Quick Start

### 1. Install Dependencies
Open a terminal in this folder and run:
```bash
npm install
```

### 2. Start the Server
To enable registrations to be saved and visible in the Admin Dashboard, you **MUST** run the server:
```bash
node server.js
```
*You should see a message saying "Leo Summit Hack'26 Server Running!" on port 3000.*

### 3. Access the Website
Open your browser and go to:  
👉 **http://localhost:3000**

> ⚠️ **IMPORTANT:** Do not simply open `index.html` file or use "Live Server" extension on port 5500. You must access via `localhost:3000` for the API to work.

---

## 🌐 How to Share via Tunnel (Cloudflare)

If you want others to access the site and register (so you see their data in your Admin panel), you need to tunnel the server port.

1.  **Start the Server** (if not already running):
    ```bash
    node server.js
    ```

2.  **Start Tunnel (in a new terminal)**:
    ```bash
    cloudflared tunnel --url http://localhost:3000
    ```
    *(Make sure you tunnel port **3000**)*

3.  **Share the Link**:
    Copy the `https://....trycloudflare.com` URL provided in the terminal output and share it with others.

4.  **View Registrations**:
    Go to `http://localhost:3000/admin.html` on your computer to see the entries.

---

## 📂 Admin Dashboard
- URL: `http://localhost:3000/admin.html`
- Password: `Leo Summit Hack'26ks2026` (Change in `admin.js` if needed)
