import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
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

const Googleprovider = new GoogleAuthProvider();
Googleprovider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const dateManager = new Date();
import * as Umanager from "./usermanager.js";
import * as Push from "../ressources/module/push/push-module.js";
//---------------------------------------------------
function CreateUserWithEmailAndPassword(auth, email, password) {
    var name = document.getElementById("pseudo").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

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
                document.cookie = "uid=" + user.uid; + ";";
                Push.PushUp(0, "Created Succifully");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                console.log(errorCode);

                switch (errorCode) {
                    case "auth/email-already-in-use":
                        Push.PushUp(3, "Cette adress/pseudo est deja utilisé");
                        break;
                    case "auth/missing-email":
                        Push.PushUp(2, "Veuillez ajouter une email");
                        break;
                    case "auth/invalid-email":
                        Push.PushUp(2, "Veuillez specifiez une email valide");
                        break;
                    case "auth/internal-error":
                        Push.PushUp(3, "Une erreur interne s'est produite (avez-vous renseigné un mots de passe ?)");
                        break;
                    case "auth/weak-password":
                        Push.PushUp(2, "Le mots de passe doit contenir au moin 6 charactères");
                        break;
                    default:
                        Push.PushUp(3, errorCode);
                        break;
                }
            });
    } else {
        Push.PushUp(2, "Vous êtes déja authentifié");
    }
}

function CreateAccountWithPopup(auth, provider) {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            console.log(user.name);
            console.log(user.email);
            console.log(user.uid);
            set(ref(database, 'users/' + user.uid), {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours()
            });
            document.cookie = "uid=" + user.uid; + ";";
            Push.PushUp(0, "Created Succifully");
            Umanager.setUserInfo();
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.error(errorCode);
            Push.PushUp(3, "Cannot login : " + errorCode);
        });
}



function CreateAccount(email, password) {

    CreateUserWithEmailAndPassword(auth, email, password);
    console.log("Created user");
    setTimeout(() => {
        Umanager.setUserInfo();
    }, 1000);

}

function CreateAccountWithGoogle() {
    CreateAccountWithPopup(auth, Googleprovider);
}

//---------------------------------------------------

function LogInWithGoogle() {
    SignInWithPopup(auth, Googleprovider);
}

function LogIn(email, password) {
    if (isUserLogged() == false) {
        console.log(email, password);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                document.cookie = "uid=" + user.uid; + ";";
                console.log("logged as :" + user.email);
                Push.PushUp(0, "Authentified at : " + email);
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
                        console.log(err);
                    });
                Umanager.setUserInfo();

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("cannot loggin : " + errorMessage + "  " + error);


                switch (errorCode) {
                    case "auth/missing-email":
                        Push.PushUp(2, "Veuillez ajouter une email");
                        break;
                    case "auth/user-not-found":
                        Push.PushUp(3, "Utilisateur non trouvé");
                        break;
                    case "auth/internal-error":
                        Push.PushUp(3, "Une erreur interne s'est produite (avez-vous renseigné un mots de passe ?)");
                        break;
                    case "auth/wrong-password":
                        Push.PushUp(3, "Le mots de passe n'est pas valide");
                        break;
                    default:
                        Push.PushUp(3, errorCode);
                        break;
                }
            });
    } else {
        console.warn("User already logged");
        Push.PushUp(2, "Vous êtes déjà authentifié");
    }
}

function SignInWithPopup(auth, provider) {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            document.cookie = "uid=" + user.uid; + ";";
            console.log("logged as :" + user.email);
            Push.PushUp(0, "Authentified as : " + user.email);
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
                    console.log(err);
                });
            Umanager.setUserInfo();
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.error(errorCode);
            Push.PushUp(3, "Cannot login : " + errorCode);
        });
}

//---------------------------------------------------

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
                    Push.PushUp(2, "Your session has expired");
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
    if (isSameDate) {
        if (date[3] == currentDate[3]) {
            return true;
        } else { return false; }
    } else {
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
//----------------------------------------------------------------
function Disconnect() {
    signOut(auth).then(() => {
        // Sign-out successful.
        eraseCookie('uid');
        Umanager.SetUserNotAuthenticated();
        console.log("Signed out");
    }).catch((error) => {
        console.error(error);
        Push.PushUp(3, error);
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

(function() {
    setTimeout(() => {
        getLogin();
    }, 100);
})();



export { CreateAccount, getCurrentUserId, isUserLogged, LogIn, getCurrentUser, Disconnect, LogInWithGoogle, CreateAccountWithGoogle };