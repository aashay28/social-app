// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCC0TRc_sBDVAh_XtnEotImvo7I3nfqM6g',
  authDomain: 'media-app-4c389.firebaseapp.com',
  projectId: 'media-app-4c389',
  storageBucket: 'media-app-4c389.appspot.com',
  messagingSenderId: '790571563437',
  appId: '1:790571563437:web:a7005c57599cc85a56c924',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
