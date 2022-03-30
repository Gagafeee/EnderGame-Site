function PushUp(type, message) {
    var panel = document.getElementById("push-hide");
    if (panel == null) {
        panel = document.getElementById("push");
        if (panel == null) { console.error("Push module is not setup"); }

    }
    const content = panel.children[2];
    panel.id = "push-hide";
    switch (type) {
        case 0:
            {
                panel.className = "push-success";
                break;
            }
        case 1:
            {
                panel.className = "push-info";
                break;
            }
        case 2:
            {
                panel.className = "push-warning";
                break;
            }
        case 3:
            {
                panel.className = "push-error";
                break;
            }
    }
    content.innerHTML = message;
    panel.id = "push";
}

function closePanel() {
    const panel = document.getElementById("push");
    if (panel == null) { console.error("Push module is not setup"); }
    const content = panel.children[2];
    panel.id = "push-closing";
    setTimeout(() => {
        panel.id = "push-hide";
    }, 1001);
}

export { closePanel, PushUp };