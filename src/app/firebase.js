import  {getApp, getApps, initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCDM0EvCG1FueKdtAuGrHNLpaBZSbjbBtk",
    authDomain: "easyscheme-ef51e.firebaseapp.com",
    projectId: "easyscheme-ef51e",
    storageBucket: "easyscheme-ef51e.appspot.com",
    messagingSenderId: "891459637035",
    appId: "1:891459637035:web:df333f0f90345364217f6e",
    measurementId: "G-XKLNFSGC1C"
  };

const app = getApps().length? getApp(): initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export{app,db,auth};