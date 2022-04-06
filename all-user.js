import * as Autenticator from './js/autenticator.js';
import * as Push from '../ressources/module/push/push-module.js';
function Load() {
    //instencing all components
    const Loader = document.getElementById("loader");

    Autenticator.getCurrentUser()
        .then(() => {
            SetUp()
            .then(() =>{
               Loader.style.display = "none";
               //finish 
            })
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

function SetUp() {
    return new Promise((resolve) => {
        Autenticator.getAllusers()
        .then((Users) => {
           const Content = document.getElementById("content");
           console.log(Users);
            for (let i = 0; i < Users.length; i+=2) {
                const HContent = document.createElement('div');
                HContent.className = 'horizontal-content';
                for (let u = 0; u < 2; u++) {
                    const newUser = document.createElement('div');
                    const newPicture = document.createElement('div');
                    const newInfos = document.createElement('div');
                    const newName = document.createElement('p');
                    const newEmail = document.createElement('p');
    
                    
    
                    newUser.className = 'user';
                    newPicture.className = 'picture';
                    newInfos.className = 'infos';
                    newName.className = 'name';
                    newEmail.className = 'email';
                    if(Users[i+u].isDisabled == true){
                        console.log("disbled");
                        newUser.className = 'user-disabled';
                    }
    
                    console.log("Get User: " +i + "["+u+"]" + " : " + (i+u) + "  " + Users[i+u].name );
                    newName.innerHTML = Users[i+u].name;
                    newEmail.innerHTML = Users[i+u].email;
                    
                    if(Users[i+u].hasCustomPP){
                        Autenticator.GetUserProfilePicture(Users[i+u].uid)
                        .then((url) => {
                            newPicture.style.backgroundImage = 'url('+url+')';
                        })
                    }
                    
    
                    Autenticator.getCurrentUser()
                    .then((user) => {
                        if(Users[i+u].uid === user.uid) {
                            const newStart = document.createElement('div');
                            newStart.className = "start";
                            newUser.appendChild(newStart);
                        }
                    })
    
                    HContent.appendChild(newUser);
                    newUser.appendChild(newPicture);
                    newUser.appendChild(newInfos);
                    newInfos.appendChild(newName);
                    newInfos.appendChild(newEmail);
                    
                }
                Content.appendChild(HContent);
                console.log(i + " : " + (i+2) + "<" + (Users.length/2));
            }
            resolve();
        })
    })
    

    
}

Load();

