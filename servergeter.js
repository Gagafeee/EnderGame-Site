var loaded = false;
var iframe = document.getElementById("servergeter");
iframe.addEventListener("load", () => {
    serverIsOn();
})
const serverStatueRound = document.getElementById("round");
const serverStatueText = document.getElementById("server-statue-text");


function serverIsOn() {
    loaded = true;
    serverStatueRound.className = "online";
    serverStatueText.innerHTML = "Online";
}

setTimeout(() => {
    UpdateStatue();
}, 500);

function UpdateStatue() {
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

     }

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