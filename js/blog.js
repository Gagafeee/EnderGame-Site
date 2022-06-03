import { set, ref, update, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";
import * as Autenticator from "../js/autenticator.js";
import * as Umanager from "./usermanager.js";
import * as Push from "../ressources/module/push/push-module.js";
import * as ReAuth from "../ressources/module/reauth/reauth-module.js";

const database = Autenticator.GetDatabase();
const storage = Autenticator.GetStorage();
const Dmanager = new Date();

function getAllArticles(){
    return new Promise((resolve, reject) => {
        /*get(ref(database, 'blog/'))
        .then((snapshot)=> {
            if(snapshot.exists()) {
              resolve(snapshot.val());  
            }else{
                resolve({})
            }
            
        })*/

        onValue(ref(database, 'blog/'), (snapshot)=> {
            if(snapshot.exists()) {
                resolve(snapshot.val());  
              }else{
                  resolve({})
              }
        })
    })
}

function GetDownloadUrl(name){
    return new Promise((resolve, reject) => {
        getDownloadURL(sRef(storage, 'blog/' + name))
        .then((url) => {
            resolve(url);
        })
        .catch((err) => {
            reject(err);
        })
    })
}


function CreateArticle(name, categorie) {
    if (Autenticator.isUserLogged()) {
        Autenticator.getCurrentUser()
            .then((user) => {
                name = name.split(' ').join('_');
                categorie = categorie.split(' ').join('_');
                /*const gsRef = sRef(Autenticator.GetStorage(), "blog/" + name);
                getDownloadURL(gsRef).then((downloadURL) => {*/
                        set(ref(database, 'blog/' + "/" + name), {
                            Name: name,
                            categorie: categorie,
                            Date: Dmanager.toDateString() + " " + Dmanager.toTimeString(),
                            path: "./" + categorie + "/" + name,
                            author: user.name/*,
                            image: downloadURL*/
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                    })

            //})
    }


}

//CreateCategorie("testCategorie")
//CreateArticle("La release V95", "Actu");

export {getAllArticles,GetDownloadUrl}

//CreateArticle("Mon Super article", "testCategorie")