import "https://mcapi.us/scripts/minecraft.js";

var loaded = false;
const serverStatueRound = document.getElementById("round");
const serverStatueText = document.getElementById("server-statue-text");


function serverIsOn() {
    loaded = true
    serverStatueRound.className = "online";
    serverStatueText.innerHTML = "Online";
}

setTimeout(() => {
    UpdateStatue();
}, 5000);

function UpdateStatue() {


    /* serverStatueRound.className = "error";
     serverStatueText.innerHTML = "Error";

     switch (loaded) {
         case false:
             {
                 serverStatueRound.className = "offline";
                 serverStatueText.innerHTML = "Offline";
                 break;
             }
         case true:
             {
                 serverStatueRound.className = "online";
                 serverStatueText.innerHTML = "Online";
                 break;
             }

     }*/
    MinecraftAPI.getServerStatus('http://node02.myhoster.fr', { /*port: 25567 /* optional, only if you need a custom port*/ },
        function(err, status) {
            console.log(status);
            if (err) {
                console.error(err);
                serverStatueRound.className = "error";
                serverStatueText.innerHTML = "Error";

            } else {
                if (status.online == false) {
                    serverStatueRound.className = "offline";
                    serverStatueText.innerHTML = "Offline";
                }
                // you can change these to your own message!
                serverStatueText.innerHTML = "Online";
                serverStatueRound.className = "online";
            }


        });
    update();
}

function update() {
    setTimeout(() => {
        loaded = false;
        iframe = document.getElementById("servergeter");
        iframe.src = iframe.src;
        //reload iframe
        setTimeout(() => {
            UpdateStatue();
        }, 5000);
        //update();
    }, 10000);

}