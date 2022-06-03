import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signOut, getAdditionalUserInfo, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getDatabase, set, ref, update, child, onValue, get } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";
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
const storage = getStorage(app);



const Googleprovider = new GoogleAuthProvider();
Googleprovider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const dateManager = new Date();
import * as Umanager from "./usermanager.js";
import * as Push from "../ressources/module/push/push-module.js";
import * as ReAuth from "../ressources/module/reauth/reauth-module.js";

export function GetDatabase() {
    return database;
}
export function GetStorage() {
    return storage;
}
export function GetApp() {
    return app;
}
//---------------------------------------------------
function CreateUserWithEmailAndPassword(auth, email, password) {
    var name = document.getElementById("pseudo").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (isUserLogged() == false) {
        if (auth.length < 16) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    set(ref(database, 'users/' + user.uid), {
                        name: name,
                        email: email,
                        uid: user.uid,
                        lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours(),
                        creationTime: user.metadata.creationTime,
                        hasCustomPP: false,
                        permisionLevel: 0
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
            Push.PushUp(2, "Votre pseudo doit être plus petit ! (16 charactères)", 5);
        }


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
            set(ref(database, 'users/' + user.uid), {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours(),
                creationTime: user.metadata.creationTime,
                hasCustomPP: false,
                permisionLevel: 0
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
    if (isUserLogged()) {
        Push.PushUp(2, "You are already logged");
    } else {
        SignInWithPopup(auth, Googleprovider);
    }

}

function LogIn(email, password) {
    if (isUserLogged() == false) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                document.cookie = "uid=" + user.uid; + ";";
                console.log("logged as :" + user.email);
                Push.PushUp(0, "Authentified at : " + email);
                update(ref(database, 'users/' + user.uid), {
                    lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours()
                });
                Umanager.setUserInfo();
                return userCredential;

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

function reLogInWithGoogle() {
    return SignInWithPopup(auth, Googleprovider);
}

function reLogIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            document.cookie = "uid=" + user.uid; + ";";
            console.log("logged as :" + user.email);
            Push.PushUp(0, "Authentified at : " + email);
            update(ref(database, 'users/' + user.uid), {
                lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours()
            });
            Umanager.setUserInfo();
            return userCredential;

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
            //this is what you need

            var uinfo = getAdditionalUserInfo(result);
            console.log(uinfo);
            var isNewUser = uinfo.isNewUser;
            if (isNewUser) {
                result.user.delete();
                Push.PushUp(1, "This Google Account is new please Create Account before connect to it")
            } else {
                // user exist
                document.cookie = "uid=" + user.uid; + ";";
                console.log("logged as :" + user.email);
                Push.PushUp(0, "Authentified as : " + user.email);
                update(ref(database, 'users/' + user.uid), {
                    lastSignInDate: dateManager.getFullYear() + "." + dateManager.getMonth() + "." + dateManager.getDate() + "." + dateManager.getHours()
                });
                Umanager.setUserInfo();
                return credential;
            }

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.error(error.message);
            Push.PushUp(3, "Cannot login : " + error.message);
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
                    Disconnect();
                    console.warn("AutoUserAuth cookie is not valide logout...");
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

function userIsDisabled(uid) {
    /*const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.isDisabled;
        } else {
            console.log("No data available");
            return ("no-data");
        }
    }).catch((error) => {
        console.error(error);
        if (error == "Error: Client is offline.") {
            Push.PushUp(2, "Your connection is weak or slow")
        }
    });*/

    onValue(ref(database, 'users/' + uid), (snapshot) => {
        if (snapshot.val().hasOwnProperty("isDisabled")) {
            return snapshot.val().isDisabled;
        } else {
            console.log("No data available (returned false)");
            return false;
        }
    })
}


function getCurrentUser() {
    return new Promise((resolve, reject) => {
        if (isUserLogged()) {
            if (!userIsDisabled(readCookie('uid'))) {
                const dbRef = ref(getDatabase());
                get(child(dbRef, `users/${readCookie('uid')}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        resolve(snapshot.val());
                    } else {
                        console.log("No data available");
                        reject("no-data");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                console.log("User Disabled");
                Push.PushUp(3, "Your account has deleted");
            }


        } else {
            console.warn("User was not logged");
            throw new Error("User-not-logged")
        }
    });
}


function getAllusers() {

    return new Promise((resolve, reject) => {
        const dbRef = ref(getDatabase());
        let Users = [0];
        Users.pop();
        get(child(dbRef, `users/`)).then((snapshot) => {
            snapshot.forEach((user) => {
                Users.push(user.val());
                resolve(Users);
            })
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    })

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
//----------------------------------------------------------------
function SaveImage(image) {
    return new Promise((resolve, reject) => {
        getCurrentUser()
            .then((user) => {
                const storageRef = sRef(storage, 'user-pp/' + user.uid + "-profile-picture");
                uploadBytes(storageRef, image).then((res) => {
                        update(ref(database, 'users/' + user.uid), {
                            hasCustomPP: true
                        });
                        resolve(true);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    })
            })
    })
}

function GetUserProfilePicture(uid) {
    return new Promise((resolve, reject) => {
        const gsRef = sRef(storage, "user-pp/" + uid + "-profile-picture");
        getDownloadURL(gsRef).then((downloadURL) => {
                resolve(downloadURL);
            })
            .catch((error) => {
                reject(error);
            })

    })
}

function ChangeCurrentUserName(username) {
    return new Promise((resolve, reject) => {
        getCurrentUser()
            .then((user) => {
                update(ref(database, 'users/' + user.uid), {
                        name: username
                    })
                    .then((user) => {
                        resolve(user);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
    })

}
//----------------------------------------------------------------
function DeleteCurrentAccount() {
    getCurrentUser()
        .then((user) => {
            if (DateIsValid(user.lastSignInDate)) {
                ReAuth.reauth()
                    .then((response) => {
                        //delete user picture
                        const gsRef = sRef(storage, "user-pp/" + user.uid + "-profile-picture");
                        deleteObject(gsRef);
                        //disable database info
                        update(ref(database, 'users/' + user.uid), {
                            isDisabled: true
                        });
                        //delete account
                        auth.currentUser.delete()
                        console.log("user deleted");
                        Disconnect();
                        Umanager.SetUserNotAuthenticated();
                        window.location.reload();
                    })
            }
        })
}
//----------------------------------------------------------------
function Addtag(tagName) {
    getCurrentUser()
        .then((user) => {
            if (user.permisionLevel > 0) {

                set(ref(database, 'users/' + user.uid + "/tags"), {
                    [tagName]: true
                })
            } else {
                console.warn("User has no permision");
                return false;
            }
        })
}
//----------------------------------------------------------------
//notif 

function SetNotificationReaded(notificationId){
    
    getCurrentUser()
    .then((user) => {
       update(ref(database, 'users/' + user.uid + '/notifications/' + notificationId), {
        hasReaded: true
        } )
        Umanager.setUserInfo();
    })
    
}
function getCurrentUserNotifications() {
    return new Promise((resolve, reject) => {
       getCurrentUser()
        .then((user) => {
            if(!user.notifications){
                resolve(new Object());
            }else {
              resolve(user.notifications);  
            }
            
        }) 
        .catch((err) => reject(err));
    })
    
}
function hasNewNotifications(){
    return new Promise((resolve, reject) => {
      getCurrentUserNotifications()
    .then((notificationsList) => {
        var r = false;
        var count = 0;
        for (let i = 0; i < notificationsList.length; i++) {
                if(!notificationsList[i].hasReaded)
                {
                    r=true;
                    count++;
                }
        }
        resolve({hasNonReadedNotifications:r,count:count});
        })  
    })
    
}

function SendNotification(content, type) {

    if (isUserLogged()) {
        getCurrentUser()
        .then((user) =>{
            var l = 0;
            if(user.hasOwnProperty("notifications")){
                l = (Object.keys(user.notifications).length);
            } 
            const date = dateManager.getFullYear() + "." + dateManager.getMonth() + " Le " + dateManager.getDate() + " à " + dateManager.getHours() +"H";
                console.log("new pos : "+ l);
                set(ref(database, 'users/' + user.uid + '/notifications/' + l), {
                content: content,
                type: type,
                date: date,
                hasReaded: false
                })
        })
        
        
    }
}
//----------------------------------------------------------------
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



export { SetNotificationReaded,hasNewNotifications,getCurrentUserNotifications,SendNotification, Addtag, getAllusers, ChangeCurrentUserName, reLogInWithGoogle, reLogIn, CreateAccount, getCurrentUserId, isUserLogged, LogIn, getCurrentUser, Disconnect, LogInWithGoogle, CreateAccountWithGoogle, SaveImage, GetUserProfilePicture, DeleteCurrentAccount };