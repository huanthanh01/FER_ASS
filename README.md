# Badminton Shop

A full-stack e-commerce web application for a Badminton Shop. This project features a robust backend built with Node.js and Express, connected to a MongoDB database, and a responsive frontend built with React, Vite, and Tailwind CSS. It also includes secure authentication via Google OAuth and local email/password login.

## 🚀 Technologies Used

### Frontend (`BadmintonShop-Web`)
*   **Framework:** React 19 (via Vite)
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS
*   **Authentication:** `@react-oauth/google`
*   **Data Visualization:** Recharts
*   **HTTP Client:** Axios
*   **Notifications:** React Toastify
*   **Icons:** React Icons

### Backend (`BadmintonShop-BE`)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** Google Auth Library, Bcrypt.js for password hashing
*   **Environment Configuration:** Dotenv
*   **CORS:** Enabled via `cors` middleware

## 🌟 Key Features

*   **User Authentication:** Secure login and registration using both local credentials (email/password with bcrypt hashing) and Google OAuth integration.
*   **Responsive UI:** A modern and fully responsive user interface built with Tailwind CSS.
*   **Product Management:** Browse and interact with badminton products.
*   **Data Visualization:** Interactive charts and dashboards implemented with Recharts.

## 📁 Project Structure

```text
FER_ASS/
│
├── BadmintonShop-BE/      # Express.js Backend
│   ├── controllers/       # Route controllers (e.g., authController.js)
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── .env               # Backend environment variables
│   ├── index.js           # Entry point for the server
│   └── package.json       # Backend dependencies
│
└── BadmintonShop-Web/     # React.js Frontend (Vite)
    ├── src/
    │   ├── pages/         # React pages (e.g., AuthPage.jsx)
    │   ├── components/    # Reusable React components
    │   ├── index.css      # Global styles and Tailwind configuration
    │   └── ...
    ├── .env               # Frontend environment variables
    ├── vite.config.js     # Vite configuration
    └── package.json       # Frontend dependencies
```

## 🛠️ Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd BadmintonShop-BE
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Create a `.env` file in the `BadmintonShop-BE` directory.
    *   Add your MongoDB connection string and JWT secret (example):
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        GOOGLE_CLIENT_ID=your_google_client_id
        ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    *The server will typically run on `http://localhost:5000`.*

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd BadmintonShop-Web
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Create a `.env` file in the `BadmintonShop-Web` directory.
    *   Add your API URL and Google Client ID:
        ```env
        VITE_API_URL=http://localhost:5000/api
        VITE_GOOGLE_CLIENT_ID=your_google_client_id
        ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    *The app will typically run on `http://localhost:5173`.*

### 3. Mobile Setup & Google Sign-In Testing (Expo Go)

Follow these steps to run the mobile app and test Google Login on your physical device (e.g. iPhone):

1. **Start the Backend:**
   Ensure the backend is running at `http://localhost:5000` (refer to Backend Setup).

2. **Start the Web App:**
   Ensure the Vite web server is running at `http://localhost:5173` (refer to Frontend Setup).

3. **Start the Local Tunnel (Important for Google Login on physical phones):**
   Open a new terminal at the root directory and run localtunnel with the custom subdomain to tunnel the web port `5173`:
   ```bash
   npx localtunnel --port 5173 --subdomain huan-badminton-shop
   ```
   *This keeps the OAuth redirection URL fixed at `https://huan-badminton-shop.loca.lt`.*

4. **Start the Mobile App:**
   Navigate to the mobile directory, install dependencies, and start Expo (clearing cache is recommended):
   ```bash
   cd BadmintonShop-FE
   npm install
   npx expo start -c
   ```

5. **Test Google Login on Phone:**
   * Open the Expo Go app on your phone and scan the Metro server's QR code.
   * Open Safari/Chrome on your phone, navigate to `https://huan-badminton-shop.loca.lt` once, type the host machine's public IP shown on the screen, and click **Continue** to bypass the localtunnel warning page.
   * Go back to the mobile app, click **Login with Google**, choose your account, and it will authenticate successfully.

## 📄 License

This project is open-source and available under the ISC License.
