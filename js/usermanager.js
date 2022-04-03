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
            //set image if exist
            if(res.hasCustomPP == true){
                Autenticator.GetUserProfilePicture(res.uid)
                .then((url) => {
                    userIcon.style.backgroundImage = "url(" + url + ")";
                })
            }
        })
        .catch((err) => {
            console.error(err);
            userName.innerHTML = "erreur";
        });
    content.setAttribute("onclick", "");
    dropdown.className = "dropdown-close";
}

function SetUserNotAuthenticated() {
    if(document.getElementById("Account") != null){
        window.history.back();

    }
    document.getElementById("user-name").innerHTML = "Se connecter";
    const userIcon = document.getElementById("user-icon");
    userIcon.style.backgroundImage = "url(../ressources/img/icon/user.svg)";
    const dropdown = document.getElementById("menu-user-dropdown");
    const content = document.getElementById("connect");
    content.setAttribute("onclick", "window.location='login.html'");
    dropdown.className = "dropdown";
    Push.PushUp(0,"Disconnected");
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