# 🏡 WanderLust – Airbnb Style Listing Web App

WanderLust is a **full-stack Airbnb-inspired web application** where users can explore, create, edit, and manage property listings with a smooth and responsive experience.

It includes **secure authentication, role-based access control, admin dashboard, cloud image uploads, and interactive maps using Mapbox**, making it a production-ready project.

---

# 🚀 Live Demo

🔗 https://wanderlust-project-ivs3.onrender.com/

---

# ✨ Features

## 🔐 Authentication & Security

* User Registration, Login & Logout
* Secure session handling with Passport.js
* Input validation & error handling

## 👤 Role-Based Access

* Admin & User roles
* Protected routes for authorized actions
* Owner/Admin control for editing & deleting listings

## 🏠 Listings Management

* Create, Edit, Delete Listings
* Add detailed property information
* Category-based listings

## 📊 Admin Dashboard

* View total users and platform statistics
* Manage all listings (Edit/Delete any listing)
* Centralized control panel for admin
* Ensures moderation and platform integrity

## 📸 Image Upload (Cloud)

* Cloud-based image storage using Cloudinary
* Optimized images with automatic compression
* Supports JPG, PNG, WEBP formats

## 📍 Map Integration (Mapbox)

* Interactive maps powered by Mapbox
* Displays listing location dynamically
* Enhances user experience with real-world visualization

## ⭐ Reviews System

* Users can add and view reviews
* Dynamic listing feedback system

## 🔎 Search & Filtering

* Search listings by keywords
* Category-based filtering system

## 📱 Responsive UI/UX

* Fully responsive design (Mobile + Desktop)
* Mobile filter section with horizontal scrolling
* Improved UX with repositioned filter toggle
* Clean and modern card-based layout

## 🎨 UI Design

* Built using Bootstrap 5
* Clean, minimal, Airbnb-inspired interface

---

# 🛠 Tech Stack

## 💻 Frontend

* HTML5
* CSS3
* Bootstrap 5
* EJS (Embedded JavaScript Templates)

## ⚙ Backend

* Node.js
* Express.js

## 🗄 Database

* MongoDB
* Mongoose

## 🔑 Authentication

* Passport.js
* Express-Session

## ☁ Cloud & Maps

* Cloudinary (Image Upload & Storage)
* Mapbox (Maps & Geolocation Services)

---

# 📂 Project Structure

```bash
MajorProject/
│
├── models/
├── routes/
├── controllers/
├── middleware/
├── views/
│   ├── layouts/
│   ├── includes/
│
├── public/
│   ├── css/
│   ├── js/
│
├── cloudConfig.js
├── app.js
└── README.md
```

---

# ⚙ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/abhishek07cng/wanderlust-project.git
```

## 2️⃣ Navigate to Project Folder

```bash
cd MajorProject
```

## 3️⃣ Install Dependencies

```bash
npm install
```

## 4️⃣ Setup Environment Variables

Create a `.env` file and add:

```env
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

MAPBOX_TOKEN=your_mapbox_token

DB_URL=your_mongodb_connection_string
SESSION_SECRET=your_secret
```

## 5️⃣ Start the Server

```bash
node app.js
```

or (recommended)

```bash
nodemon app.js
```

## 6️⃣ Open in Browser

http://localhost:3000

---

# 📱 Responsive Design Highlights

* Desktop optimized navigation layout
* Mobile hamburger menu
* Scrollable filter bar (mobile-friendly)
* Improved layout spacing & alignment
* Role-based dashboard visibility

---

# 📌 Future Improvements

* ⭐ Wishlist Feature
* 💳 Payment Integration (Stripe/Razorpay)
* 📊 Advanced Admin Analytics Dashboard
* 🔔 Notifications System
* 🌍 Advanced Map Filters

---

# 👨‍💻 Author

**Abhishek Kumar Singh**
🔗 GitHub: https://github.com/abhishek07cng

---

# 📜 License

This project is built for **educational and portfolio purposes**.
