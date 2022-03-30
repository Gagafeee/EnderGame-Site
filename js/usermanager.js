import * as Autenticator from "../js/autenticator.js";


function setUserInfo() {
    const userIcon = document.getElementById("user-icon");
    const userName = document.getElementById("user-name");
    const content = document.getElementById("connect");
    const dropdown = document.getElementById("menu-user-dropdown");
    Autenticator.getCurrentUser()
        .then((res) => {
            console.log("User logged as : " + res.name);
            userName.innerHTML = res.name;
        })
        .catch((err) => {
            console.error(err);
            userName.innerHTML = "erreur";
        });
    content.setAttribute("onclick", "");
    dropdown.className = "dropdown-close";
}

function SetUserNotAuthenticated() {
    document.getElementById("user-name").innerHTML = "Se connecter";
    const dropdown = document.getElementById("menu-user-dropdown");
    const content = document.getElementById("connect");
    content.setAttribute("onclick", "window.location='login.html'");
    dropdown.className = "dropdown";
}

function updateDropdown() {
    const drop = document.getElementById("menu-user-dropdown");
    if(drop.className != "dropdown"){
        const isOpened = drop.className === "dropdown-close";
            if (isOpened) {
                drop.className = "dropdown-open";
            } else {
                drop.className = "dropdown-close";
            }
    }else{
        console.log("dropdown is not available");
    }
    
}


export { setUserInfo, SetUserNotAuthenticated, updateDropdown };