var loaded = false;
function serverIsOn(){loaded = true}

setTimeout(() => {
       console.log(loaded); 
       UpdateStatue();
}, 5000);

function UpdateStatue()
{
    round = document.getElementById("round");
    text = document.getElementById("server-statue-text");

    round.className = "error";
    text.innerHTML = "Error";
    
    switch (loaded){
        case false:{
            round.className = "offline";
            text.innerHTML = "Offline";
            break;
        }
        case true:{
            round.className = "online";
            text.innerHTML = "Online";
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
    update();
}, 10000);

}
