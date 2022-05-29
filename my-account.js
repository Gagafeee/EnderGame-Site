import * as Autenticator from './js/autenticator.js';
import * as Push from "../ressources/module/push/push-module.js";
import * as Umanager from "../js/usermanager.js";
import * as NotificationManager from "../js/notification.js";

function Load() {
    //instencing all components
    const Loader = document.getElementById("loader");
    ChangeContent("user-infos");
    document.getElementById("ISw-info-button").className = "button-selected";

    Autenticator.getCurrentUser()
        .then((response) => {
            UpdateInfos(response);
            //finish
            Loader.style.display = "none";
        })
        .catch((err) => {

            if (err.message == "User-not-logged") {
                Push.PushUp(3, "You are not logged ! (redirecting...)");
                setTimeout(() => {
                    window.history.back();
                }, 2000);
            }
        })
}

function UpdateInfos(User) {
    Umanager.setUserInfo();
    const UserName = document.getElementById("userName");
    const UserPicture = document.getElementById("picture");

    const IUserName = document.getElementById("username");
    const IEmail = document.getElementById("email");
    const ICreationDate = document.getElementById("creation-date");

    if (User.name != null) {
        UserName.innerHTML = User.name;
        IUserName.innerHTML = User.name;
    } else {
        UserName.innerHTML = "Pseudo not found";
        IUserName.innerHTML = "Pseudo not found";
    }
    if (User.picture != null) {
        UserPicture.style.backgroundImage = User.picture;
    } else { /*Make it by depault*/ }
    if (User.email != null) {
        IEmail.innerHTML = User.email;
    } else { IEmail.innerHTML = "Email Not found"; }


    Autenticator.getCurrentUser()
        .then((result) => {
            ICreationDate.innerHTML = result.creationTime;
            //load picture
            if (result.hasCustomPP == true) {
                UserPicture.style.backgroundImage = "url(../ressources/img/icon/loading.svg)"
                Autenticator.GetUserProfilePicture(result.uid).then((url) => {
                    UserPicture.style.backgroundImage = "url(" + url + ")";
                })
            }

        })
        .catch((error) => {
            console.log(error);
        })

    //Notif
    RefreshNotifications();
}

function RefreshNotifications() {
    //Autenticator.SendNotification("new notif",2)
    Autenticator.hasNewNotifications()
        .then((responce) => {
            console.log(responce);
        })
    document.getElementById("notifLoader").style.display = "block";
    Autenticator.getCurrentUserNotifications()
        .then((notificationsList) => {
            const C = document.getElementById("notification");
            while (C.firstChild) {
                C.removeChild(C.lastChild);
            }
            const loader = document.createElement("div");
            loader.className = "loading";
            loader.id = "notifLoader";
            C.appendChild(loader);
            for (let i = 0; i < Object.keys(notificationsList).length; i++) {
                const container = document.createElement("div");
                container.dataset.id = i;
                container.className = "notification";
                switch (notificationsList[i].type) {
                    case 0:
                        container.dataset.type = "error";
                        break;

                    case 1:
                        container.dataset.type = "alert";
                        break;

                    case 2:
                        container.dataset.type = "info";
                        break;
                }
                const Icon = document.createElement("div");
                    Icon.className = "icon";
                    container.appendChild(Icon);
                const Content = document.createElement("div");
                    Content.className = "container";
                    const text = document.createElement("p");
                        text.innerHTML = notificationsList[i].content;
                        Content.appendChild(text);
                    const Infos = document.createElement("div");
                        Infos.className = "infos";
                        const date = document.createElement("p");
                            date.className = "date";
                            date.innerHTML = notificationsList[i].date;
                        Infos.appendChild(date);
                        Content.appendChild(Infos);
                container.appendChild(Content);

                const Button = document.createElement("div");
                        if(notificationsList[i].hasReaded == false){
                            Button.className = "valid-button";
                            Button.addEventListener("click", () =>{
                                Autenticator.SetNotificationReaded(i);
                                setTimeout(() =>{
                                 RefreshNotifications();   
                                },100)
                                
                            })  
                        }else if(notificationsList[i].hasReaded == true){
                          Button.className = "disabled-button";  
                        }
                        
                        
                container.appendChild(Button);
                C.appendChild(container);
            }
            Autenticator.hasNewNotifications()
                .then((response) => {
                    document.getElementById("ISw-notification-button").dataset.notif = response.hasNonReadedNotifications;
                })
            document.getElementById("notifLoader").style.display = "none";
        })
}

function OpenPictureEditMode() {
    const Panel = document.getElementById("profile-picture");
    document.getElementById("Account").dataset.ptoolopen = "true";
    Panel.className = "edit";
}

function ClosePictureEditMode() {
    const Panel = document.getElementById("profile-picture");
    document.getElementById("Account").dataset.ptoolopen = "false";
    Panel.className = "normal";
}


function getMinecraftProfile(profile) {
    return "https://minotar.net/avatar/" + profile;
}

function DownloadUserProfilePicture() {
    Autenticator.getCurrentUser()
        .then((user) => {
            Autenticator.GetUserProfilePicture(user.uid).then((url) => {
                window.open(url, "NEW");
            })
        })

}

function SetMinecraftPicture() {

    const pseudo = document.getElementById("ptool-text-input").value;
    document.getElementById("ptool-mcSet").style.backgroundImage = "url(../ressources/img/icon/loading.svg)";
    fetch(getMinecraftProfile(pseudo))
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
            Autenticator.SaveImage(blob)
                .then(() => {
                    Autenticator.getCurrentUser().then((user) => {
                        UpdateInfos(user);
                        document.getElementById("ptool-mcSet").style.backgroundImage = "url(../ressources/img/icon/done.svg)";
                        setTimeout(() => {
                            document.getElementById("ptool-mcSet").style.backgroundImage = "url(../ressources/img/icon/steve.png)";
                        }, 3000);
                    })
                })
                .catch((err) => {
                    console.log(err);
                    document.getElementById("ptool-mcSet").style.backgroundImage = "url(../ressources/img/icon/close.svg)";
                })
        });
}

function DeleteAccount() {
    Autenticator.DeleteCurrentAccount();
}


function EditUserName() {
    if (document.getElementById("username-input").style.display != "block") {
        document.getElementById("edit-username").style.backgroundImage = "url(../ressources/img/icon/arrow_right.svg)";
        document.getElementById("username").style.display = "none";
        document.getElementById("username-input").value = document.getElementById("username").innerHTML;
        document.getElementById("username-input").style.display = "block";
        document.getElementById("edit-username").id = "edit-username";
        document.getElementById("edit-username").addEventListener("click", function() {
            document.getElementById("edit-username").style.backgroundImage = "url(../ressources/img/icon/loading.svg)";
            const name = document.getElementById("username-input").value;
            document.getElementById("username").style.display = "block";
            document.getElementById("username-input").style.display = "none";
            if (!Autenticator.UsernameExist(name)) {
                Autenticator.ChangeCurrentUserName(name)
                    .then(() => {
                        document.getElementById("edit-username").style.backgroundImage = "url(../ressources/img/icon/done.svg)";
                        Autenticator.getCurrentUser()
                            .then((user) => {
                                UpdateInfos(user);
                            })
                        setTimeout(() => {
                            document.getElementById("edit-username").style.backgroundImage = "url(../ressources/img/icon/edit.svg)";
                        }, 4000);


                    })
                    .catch((err) => {
                        document.getElementById("edit-username").style.backgroundImage = "url(../ressources/img/icon/close.svg)";
                        console.log(err);
                    })

            } else {
                Push.PushUp(2, "This name already exists");
            }





        })
    }

}

function ChangeContent(id) {
    const InfosPanel = document.getElementById("user-infos");
    const NotifPanel = document.getElementById("notification");
    const ActionPanel = document.getElementById("actions");
    const StatPanel = document.getElementById("stats");
    switch (id) {
        case "user-infos":
            {
                InfosPanel.style.display = "flex";
                ActionPanel.style.display = "none";
                StatPanel.style.display = "none";
                NotifPanel.style.display = "none";
                break;
            }
        case "notif":
            {
                InfosPanel.style.display = "none";
                ActionPanel.style.display = "none";
                StatPanel.style.display = "none";
                NotifPanel.style.display = "flex";
                break;
            }
        case "action":
            {
                InfosPanel.style.display = "none";
                ActionPanel.style.display = "flex";
                StatPanel.style.display = "none";
                NotifPanel.style.display = "none";
                break;
            }
        case "stats":
            {
                InfosPanel.style.display = "none";
                ActionPanel.style.display = "none";
                StatPanel.style.display = "flex";
                NotifPanel.style.display = "none";
                break;
            }
    }
}
document.getElementById("ISw-info-button").addEventListener("click", () => {
    ChangeContent("user-infos");
    document.getElementById("ISw-info-button").className = "button-selected";
    document.getElementById("ISw-action-button").className = "button";
    document.getElementById("ISw-stats-button").className = "button";
    document.getElementById("ISw-notification-button").className = "button";
})
document.getElementById("ISw-notification-button").addEventListener("click", () => {
    ChangeContent("notif");
    RefreshNotifications();
    document.getElementById("ISw-info-button").className = "button";
    document.getElementById("ISw-stats-button").className = "button";
    document.getElementById("ISw-action-button").className = "button";
    document.getElementById("ISw-notification-button").className = "button-selected";
})
document.getElementById("ISw-action-button").addEventListener("click", () => {
    ChangeContent("action");
    document.getElementById("ISw-info-button").className = "button";
    document.getElementById("ISw-action-button").className = "button-selected";
    document.getElementById("ISw-stats-button").className = "button";
    document.getElementById("ISw-notification-button").className = "button";
})
document.getElementById("ISw-stats-button").addEventListener("click", () => {
    ChangeContent("stats");
    document.getElementById("ISw-info-button").className = "button";
    document.getElementById("ISw-stats-button").className = "button-selected";
    document.getElementById("ISw-action-button").className = "button";
    document.getElementById("ISw-notification-button").className = "button";
})



document.getElementById("ptool-upload").onchange = function() {
    document.getElementsByClassName("ptool-upload-label")[0].style.backgroundImage = "url(../ressources/img/icon/loading.svg)";
    var fileList = document.getElementById("ptool-upload").files;

    Autenticator.SaveImage(fileList[0]).then((res) => {
            document.getElementsByClassName("ptool-upload-label")[0].style.backgroundImage = "url(../ressources/img/icon/done.svg)";
            Autenticator.getCurrentUser().then((user) => {
                UpdateInfos(user);
            })
        })
        .catch((err) => {
            console.log(err);
            document.getElementsByClassName("ptool-upload-label")[0].style.backgroundImage = "url(../ressources/img/icon/close.svg)";
        });
    setTimeout(() => {
        document.getElementsByClassName("ptool-upload-label")[0].style.backgroundImage = "url(../ressources/img/icon/upload.svg)";
    }, 3000);
}
setTimeout(() => {
    Load();
}, 200);

export { EditUserName, OpenPictureEditMode, ClosePictureEditMode, DownloadUserProfilePicture, SetMinecraftPicture, DeleteAccount };