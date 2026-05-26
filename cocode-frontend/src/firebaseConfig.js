import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Credenciales oficiales de tu proyecto "cocode"
const firebaseConfig = {
  apiKey: "AIzaSyDVFCGa6CcZg1yixcxn1oFDB80TvRjqXg0",
  authDomain: "cocode-6e89d.firebaseapp.com",
  projectId: "cocode-6e89d",
  storageBucket: "cocode-6e89d.firebasestorage.app",
  messagingSenderId: "295842779164",
  appId: "1:295842779164:web:333fc25631d4e18282cfd9",
  measurementId: "G-YVRQ9CFR9X"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios para usar en App.jsx
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
