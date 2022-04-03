import * as Autenticator from '../../../js/autenticator.js';

function Close() {
    if (document.getElementById("reauth") == null) {
        consol.error("not-enabled");
    } else {
        const panel = document.getElementById("reauth");
        panel.className = "hide";
    }
}

function reauth() {

    return new Promise((resolve, reject) => {
        if (document.getElementById("reauth") == null) {
            reject("not-enabled");
        } else {
            const panel = document.getElementById("reauth");
            panel.className = "show";

            document.getElementById("formsend").addEventListener("click", function () {
                const userEmail = document.getElementById("mail").value;
                const userPassword = document.getElementById("password").value;
                document.cookie = "uid" + '=; Max-Age=0';
                const usercredencial = Autenticator.reLogIn(userEmail, userPassword)
                Close();
                resolve(usercredencial);
            })

            document.getElementById("google").addEventListener("click", function () {
                
                document.cookie = "uid" + '=; Max-Age=0';
                const usercredencial = Autenticator.reLogInWithGoogle()
                Close();
                resolve(usercredencial);
            })
        }
    })
}

export {
    Close,
    reauth
};