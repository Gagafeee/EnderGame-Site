import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getDatabase, set, ref, push, child, onValue, get } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
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

const dateManager = new Date();

import * as Umanager from "./usermanager.js";

function CreateUserWithEmailAndPassword(auth, email, password) {
    var name = document.getElementById("pseudo").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    const return_panel = document.getElementById("return_panel");
    if (isUserLogged() == false) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                set(ref(database, 'users/' + user.uid), {
                    name: name,
                    email: email,
                    uid: user.uid,
                    lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours()
                });
                //document.cookie = "username=" + name + ";";
                //document.cookie = "email=" + email + ";";
                document.cookie = "uid=" + user.uid; + ";";
                return_panel.children[0].innerHTML = "Created Succifully";
                return_panel.className = "return_panel_valid";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                console.log(errorCode);

                return_panel.className = "return_panel_unvalid";
                switch (errorCode) {
                    case "auth/email-already-in-use":
                        return_panel.children[0].innerHTML = "Cette adress/pseudo est deja utilisé";
                        break;
                    case "auth/missing-email":
                        return_panel.children[0].innerHTML = "Veuillez ajouter une email";
                        break;
                    case "auth/invalid-email":
                        return_panel.children[0].innerHTML = "Veuillez specifiez une email valide";
                        break;
                    case "auth/internal-error":
                        return_panel.children[0].innerHTML = "Une erreur interne s'est produite (avez-vous renseigné un mots de passe ?)"
                        break;
                    case "auth/weak-password":
                        return_panel.children[0].innerHTML = "Le mots de passe doit contenir au moin 6 charactères"
                        break;
                    default:
                        return_panel.children[0].innerHTML = errorCode;
                        break;
                }
            });
    } else {
        return_panel.children[0].innerHTML = "Vous êtes déjà authentifié !";
        return_panel.className = "return_panel_unvalid";
    }
}

function CreateAccount() {

    CreateUserWithEmailAndPassword(auth, email, password);
    console.log("Created user");
    setTimeout(() => {
        Umanager.setUserInfo();
    }, 1000);

}

function LogIn(email, password) {
    if (isUserLogged() == false) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                document.cookie = "uid=" + user.uid; + ";";
                console.log("logged as :" + user.email);
                Umanager.setUserInfo();
                return_panel.children[0].innerHTML = "Authentified at : " + email;
                return_panel.className = "return_panel_valid";
                getCurrentUser()
                .then((res) => {
                    set(ref(database, 'users/' + user.uid), {
                    name: res.name,
                    email: email,
                    uid: user.uid,
                    lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours()
                });
                })
                .catch((err) => {
                    
                });
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("cannot loggin :" + errorMessage);

                return_panel.className = "return_panel_unvalid";
                switch (errorMessage) {
                    case "auth/missing-email":
                        return_panel.children[0].innerHTML = "Veuillez ajouter une email";
                        break;
                    case "auth/user-not-found":
                        return_panel.children[0].innerHTML = "Utilisateur non trouvé";
                        break;
                    case "auth/internal-error":
                        return_panel.children[0].innerHTML = "Une erreur interne s'est produite (avez-vous renseigné un mots de passe ?)"
                        break;
                    case "auth/wrong-password":
                        return_panel.children[0].innerHTML = "Le mots de passe n'est pas valide"
                        break;
                    default:
                        return_panel.children[0].innerHTML = errorCode;
                        break;
                }
            });
    } else {
        console.warn("User already logged");
        return_panel.className = "return_panel_unvalid";
        return_panel.children[0].innerHTML = "Vous êtes déjà authentifié";
    }
}

function getLogin() {
    if (readCookie('uid')) {
        getCurrentUser()
            .then((res) => {
                var lastSignInDate = res.lastSignInDate;
                console.log("isValid : " + DateIsValid(lastSignInDate));
                if (DateIsValid(lastSignInDate)) {
                    Umanager.setUserInfo();
                } else {
                    Umanager.SetUserNotAuthenticated();
                    eraseCookie("uid");
                    console.warn("AutouserAuth cookie is not valide logout...");
                }
            })
            .catch((err) => {
                console.error(err);
            });


    } else {
        Umanager.SetUserNotAuthenticated();
        console.log("Cannot read user id");
    }
}

function DateIsValid(d) {
    const date = d.split('.');
    for (let i = 0; i < date.length; i++) {
        date[i] = parseInt(date[i]);
    }
    const currentDate = [
        dateManager.getFullYear(),
        dateManager.getMonth(),
        dateManager.getDate(),
        dateManager.getHours()
    ];
    
    const isSameDate = date[0] === currentDate[0] &&
    date[2] === currentDate[2] &&
    date[1] === currentDate[1];
    if(isSameDate) {
        if(date[3] == currentDate[3]) {
            return true;
        }else{return false;}
    }else{
        return false;
    }

}


function isUserLogged() {
    var logged = readCookie('uid');
    if (logged) { return true; } else { return false; }
}

function getCurrentUserId() {
    var uid = readCookie('uid');
    if (uid != null) {
        return uid;
    } else {
        console.warn("User was not logged");
        return false;
    }
}


function getCurrentUser() {
    return new Promise((resolve, reject) => {
        if (isUserLogged()) {
            if (true) {
                const dbRef = ref(getDatabase());
                get(child(dbRef, `users/${readCookie('uid')}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        resolve(snapshot.val());
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                reject("Promise rejected");
            }
        } else {
            console.warn("User was not logged");
            return false;
        }
    });
}




function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0'
}



getLogin();

export { CreateAccount, getCurrentUserId, isUserLogged, LogIn, getCurrentUser };