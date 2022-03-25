import * as Autenticator from "../js/autenticator.js";


function setUserInfo() {
    const userIcon = document.getElementById("user-icon");
    const userName = document.getElementById("user-name");
    Autenticator.getCurrentUser()
        .then((res) => {
            console.log("User logged as : " + res.name);
            userName.innerHTML = res.name;
        })
        .catch((err) => {
            console.error(err);
            userName.innerHTML = "erreur";
        });
}

function SetUserNotAuthenticated() {
    document.getElementById("user-name").innerHTML = "Login";
}
export { setUserInfo, SetUserNotAuthenticated };