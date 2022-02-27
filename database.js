import { initializeApp } from '../node_modules/firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyArmpo4XebOJoOgCH1t1of3geAWdCL0c_g",

    authDomain: "ender-game.firebaseapp.com",

    databaseURL: "https://ender-game-default-rtdb.europe-west1.firebasedatabase.app",

    projectId: "ender-game",

    storageBucket: "ender-game.appspot.com",

    messagingSenderId: "473855133647",

    appId: "1:473855133647:web:9ed226575b31b1323ab4ba",

    measurementId: "G-6SKPJJ3Z38"

};

const app = initializeApp(firebaseConfig);
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyArmpo4XebOJoOgCH1t1of3geAWdCL0c_g',
    authDomain: 'ender-game.firebaseapp.com',
    projectId: '473855133647'
});

var db = firebase.firestore();