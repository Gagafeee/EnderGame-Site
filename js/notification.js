import * as Autenticator from "../js/autenticator.js";

function getNotifications() {
    return new Promise((resolve, reject) => {
        Autenticator.getCurrentUser()
            .then((user) => {})
    })

}

export { getNotifications }