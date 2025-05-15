import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD4l3i5d4dSnjJmBVPSnB2WpuDncc2rojM",
  authDomain: "paf45-aadab.firebaseapp.com",
  projectId: "paf45-aadab",
  storageBucket: "paf45-aadab.appspot.com", // ✅ Correct bucket format
  messagingSenderId: "633984234657",
  appId: "1:633984234657:web:35e5111ee382250a446ce0",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
