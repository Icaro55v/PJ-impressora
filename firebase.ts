// This file relies on the Firebase SDKs being loaded globally in print_queue_manager.html

declare global {
    interface Window {
        firebase: any;
    }
}

const firebaseConfig = {
  apiKey: "AIzaSyD1k7xHT1gJj71cX6IQIgsZxYSoFrQuz9Q",
  authDomain: "stockmind-ai-lite.firebaseapp.com",
  databaseURL: "https://stockmind-ai-lite-default-rtdb.firebaseio.com",
  projectId: "stockmind-ai-lite",
  storageBucket: "stockmind-ai-lite.firebasestorage.app",
  messagingSenderId: "120136368220",
  appId: "1:120136368220:web:c6d547fb48d6f5aa71e699"
};

let app, auth, db;
const appId = firebaseConfig.projectId;

try {
    if (window.firebase && !window.firebase.apps.length) {
        app = window.firebase.initializeApp(firebaseConfig);
    } else {
        app = window.firebase.app(); // Get existing app
    }
    auth = window.firebase.auth();
    db = window.firebase.database();
} catch (e) {
    console.error("Firebase initialization error:", e);
    alert("Falha ao inicializar a aplicação. Verifique a consola.");
}

export { auth, db, appId };
