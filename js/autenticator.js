import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

import { getDatabase, set, ref, push, child } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyArmpo4XebOJoOgCH1t1of3geAWdCL0c_g",
    authDomain: "ender-game.firebaseapp.com",
    databaseURL: "https://ender-game-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ender-game",
    storageBucket: "ender-game.appspot.com",
    messagingSenderId: "473855133647",
    appId: "1:473855133647:web:9ed226575b31b1323ab4ba",
    measurementId: "G-6SKPJJ3Z38"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });


function Send() {

    var name = document.getElementById("pseudo").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;;
    /*set(ref(database, 'users/' + userId), {
       name: name,
       email: email,
       password: password
    }); */
    createUserWithEmailAndPassword(auth, email, password);
    console.log("send");
}


export {Send};