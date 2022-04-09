import "./node_modules/three/build/three.js";
import "https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/controls/OrbitControls.js";
import "https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js";


        const renderer = new THREE.WebGLRenderer({alpha: true});
        const camera = new THREE.PerspectiveCamera(60, (window.innerWidth/2.5) / (window.innerHeight/1), 1, 5000);
        const scene = new THREE.Scene();
        let light;

        function init() {
            
            camera.position.set(0, 0, 65);
            var point = new THREE.Vector3( 0, 0, - 1 );
            point.applyQuaternion( camera.quaternion );
            camera.lookAt(point);
            renderer.setSize((window.innerWidth/2.5), (window.innerHeight/1));
            document.getElementById("island").appendChild(renderer.domElement);
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.physicallyCorrectLights = true;
        }

        function setLight() {
            light = new THREE.AmbientLight('white'); // soft white light
            light.intensity = 1.5;
            scene.add(light);
            const dLight = new THREE.DirectionalLight();
            dLight.intensity = 0.5;
            dLight.position.set(1.105, 38.522, 6.226);
            scene.add(dLight);
        }

        function loadGLTF() {
            const gltfLoader = new THREE.GLTFLoader();
            const url = 'ressources/map/map3.1.glb';
            gltfLoader.load(url, (gltf) => {
                const root = gltf.scene;
                scene.add(root);
            });
        }
        const controls = new THREE.OrbitControls( camera, renderer.domElement );

        // auto rotate
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.25;
        controls.target = new THREE.Vector3(.5, .5, .5);


 
        // vertical angle control
        controls.minPolarAngle = -Math.PI / 1.5;
        controls.maxPolarAngle = Math.PI / 1.5;

        controls.enablePan = false;
		controls.enableZoom = true; 
        controls.zoomSpeed = 1;
        controls.dynamicDampingFactor = 0.2;
        controls.maxDistance = 70;
        controls.minDistance = 60;
		controls.enableDamping = true;
		controls.minPolarAngle = 0.8;
		controls.maxPolarAngle = 2.4;
		controls.dampingFactor = 0.07;
		controls.rotateSpeed = 0.2;
        camera.position.set(0, 20, 100);
        controls.update();

        function animate() {

            requestAnimationFrame(animate);

            // required if controls.enableDamping or controls.autoRotate are set to true
            controls.update();
            renderer.render(scene, camera);
        }

        init();
        setLight();
        loadGLTF();
        animate();