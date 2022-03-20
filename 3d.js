import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/js/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 20, 100);

//put 3d file
function setLight() {
    light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);
}

function loadGLTF() {
    const gltfLoader = new GLTFLoader();
    const url = 'ressources/map/map.glb';
    gltfLoader.load(url, (gltf) => {
        const root = gltf.scene;
        scene.add(root);
    });
}


loadGLTF();
setLight();

renderer.render(scene, camera);