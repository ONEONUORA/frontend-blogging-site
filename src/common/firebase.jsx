
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCNQLGK9Lu9fTdwb4hVEhlXgTB-JAlNIDQ",
  authDomain: "chidex-blogging-site.firebaseapp.com",
  projectId: "chidex-blogging-site",
  storageBucket: "chidex-blogging-site.appspot.com",
  messagingSenderId: "663512502326",
  appId: "1:663512502326:web:2d6be39654125ebee60897"
};

// Initialize Firebase***********************************************************
const app = initializeApp(firebaseConfig);



//authenication********************************************************************************


const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () =>{
     
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result)=>{
        user = result.user
    })
    .catch((err)=>{
        console.log(err)
    })
    return user;
}