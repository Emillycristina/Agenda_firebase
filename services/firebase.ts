import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDpRr2sTZN51fOcOWad6VBPXei5uvSe3Rg",
  authDomain: "agenda-f0853.firebaseapp.com",
  projectId: "agenda-f0853",
  storageBucket: "agenda-f0853.appspot.com",
  messagingSenderId: "1005762929331",
  appId: "1:1005762929331:web:388c7f5f76d6b0f33086c6"
};

// Inicializar o aplicativo Firebase
const app = initializeApp(firebaseConfig);

// Obter a instância do banco de dados
const database = getDatabase(app);

export { database, app as firebase };
