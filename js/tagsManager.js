import * as Push from "../ressources/module/push/push-module.js";
import * as Autenticator from "../js/autenticator.js";

function AddTag(tagId) {
    Autenticator.Addtag(tagId);
}

function RemoveTag() {}

function GetCurrentUserTags() {
    return new Promise((resolve, reject) => {
        Autenticator.getCurrentUser()
            .then((user) => {
                resolve(user.tags);
            })
    })
}

export { AddTag, RemoveTag, GetCurrentUserTags }