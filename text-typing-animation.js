import * as Push from "../ressources/module/push/push-module.js";
var words = ['play.mcendergame.tk'],
    part,
    i = 0,
    offset = 0,
    len = words.length,
    forwards = true,
    skip_count = 0,
    skip_delay = 50,
    speed = 60;
function wordflick(a) {
    setInterval(function () {
        if (a) {
            if (forwards) {
                if (offset >= words[i].length) {
                    ++skip_count;
                    if (skip_count == skip_delay) {
                        forwards = false;
                        skip_count = 0;
                    }
                }
            } else {
                if (offset == 0) {
                    forwards = true;
                    i++;
                    offset = 0;
                    if (i >= len) {
                        i = 0;
                    }
                }
            }
            part = words[i].substr(0, offset);
            if (skip_count == 0) {
                if (forwards) {
                    offset++;
                } else {
                    offset--;
                }
            }
            $('.ip').text(part);
        }
    }, speed);

};

document.getElementsByClassName("ip")[0].addEventListener("click", function () {
    navigator.clipboard.writeText('play.mcendergame.tk');
    Push.PushUp(1, "Copied ip in clipboard !", 2.5)
})

export {wordflick}