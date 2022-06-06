import { KeyDisplay } from './utils';
import { CharacterControls } from './characterControls';
import * as THREE from 'three'
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { mode } from '../webpack.config';
// SCENE
const scene = new THREE.Scene();
const loader_ = new THREE.TextureLoader();
scene.background = loader_.load("./textures/galaxy.jpg");

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;


const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( './sounds/music.ogg', function( buffer ) {
// 	sound.setBuffer( buffer );
// 	sound.setLoop( true );
// 	sound.setVolume(0.5 );
// 	sound.play();
// });


// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 15
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// LIGHTS
light()

// FLOOR
generateFloor()

// MODEL WITH ANIMATIONS
var characterControls: CharacterControls
new GLTFLoader().load('models/Soldier.glb', function (gltf) {
    var model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.position.set(1.13,0,31)
    scene.add(model);
    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map()
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })
    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera,  'Idle')
});

//
function addLight(tmp : number, color_:string,tmp_y : number,tmp_z :number){
	var color = new THREE.Color(color_),
    intensity = 6,
    distance = 10,
    angle = 90,
    penumbra = 0.25,
    decay = 0.5;
    var spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
    spotLight.castShadow = true;
    spotLight.position.setX(tmp);
	spotLight.position.setY(tmp_y);
    spotLight.position.setZ(tmp_z);
	scene.add(spotLight);
}
function addPointLight(tmp: number,tmp1 :number){
    var color = new THREE.Color("red"),
    intensity = 10,
    distance = 20,
    decay = 0.5;
    var pointLight = new THREE.PointLight(color, intensity, distance, decay);
    pointLight.castShadow = true;
    pointLight.position.setX(tmp);
    pointLight.position.setY(14);
    pointLight.position.setZ(tmp1);
    scene.add(pointLight);
}
addPointLight(-19,12);
addPointLight(19,12);
//

new MTLLoader()
	.setPath( 'models/pedestal/' )
	.load( 'pedestal.mtl', function ( materials ) {

			materials.preload();

			new OBJLoader()
				.setMaterials( materials )
				.setPath( 'models/pedestal/' )
				.load( 'pedestal.obj', function ( object ) {
                    object.traverse(function (object: any) {
                        if (object.isMesh) object.castShadow = true;
                        if (object.isMesh) object.receiveShadow = true;
                    });
					object.scale.set(0.03,0.03,0.03);
                    object.position.setY(1);
                    object.position.setZ(-6.5);
                    bb2 = new THREE.Box3().setFromObject(object);
					scene.add( object );
				}, onprogress);

		} );
// Load theater
new GLTFLoader().load('models/theater/scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = false;
        if (object.isMesh) object.receiveShadow = true;
    });
    model.scale.set(0.5,0.5,0.5);
    model.position.setY(-4);
    scene.add(model);
});
new GLTFLoader().load('models/logo/scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = false;
    });
    model.scale.set(0.025,0.025,0.025);
    model.position.setY(12);
    model.position.setZ(3);
    scene.add(model);
});

// load kyurem
export var bb2: any;
new GLTFLoader().load('models/kyurem/scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.position.setY(1.5);
    model.position.setZ(-5);
    model.scale.set(3,3,3);
    scene.add(model);
    addLight(0,"blue",20,-5);
});

// load pokeball
new GLTFLoader().load('models/pokeball/scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.scale.set(0.5,0.5,0.5);
    model.position.setY(1);
    model.position.setX(21);
    model.position.setZ(6);
    const model1 = model.clone();
    model1.position.setY(1);
    model1.position.setX(-21);
    model1.position.setZ(6);
    scene.add(model);
    scene.add(model1);
});
new GLTFLoader().load('models/luxray/scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.position.setY(1.1);
    model.position.setX(-12);
    model.scale.set(0.04,0.04,0.04);
    addLight(-10,"violet",10,0);
    scene.add(model);
    
});

new GLTFLoader().load('models/pokemon/scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.position.setY(1.1);
    model.position.setX(14);
    model.scale.set(0.015,0.015,0.015);
    model.rotateY(91);
    scene.add(model);
    addLight(10,"purple",10,0);
    
});

export var bb3: any;
new GLTFLoader().load('models/pokemon1/scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.position.setY(0);
    model.position.setX(5);
    model.scale.set(0.015,0.015,0.015);
    bb3 = new THREE.Box3().setFromObject(model);
    scene.add(model);
    // addLight(10,"purple",10,0);
    
});
// MODEL 1
export var bb1: any;
const loader = new GLTFLoader().setPath('models/pikachu/');
loader.load( 'pikachu.glb', function ( gltf ) {
    var model1 = gltf.scene;
    model1.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model1.scale.set(0.5,0.5,0.5);
    model1.position.setY(1.2);
    model1.position.setX(-5);
    bb1 = new THREE.Box3().setFromObject(model1);
	scene.add( model1 );
} );

// MODEL 2
// export var bb2: any;
// new MTLLoader()
// 	.setPath( 'models/charizard/' )
// 	.load( 'charizard.mtl', function ( materials ) {

// 			materials.preload();

// 			new OBJLoader()
// 				.setMaterials( materials )
// 				.setPath( 'models/charizard/' )
// 				.load( 'charizard.obj', function ( object ) {
//                     object.traverse(function (object: any) {
//                         if (object.isMesh) object.castShadow = true;
//                     });
// 					object.scale.set(0.5,0.5,0.5);
//                     object.position.setY(Math.PI/2 - 0.7);
//                     object.position.setZ(-5);
//                     bb2 = new THREE.Box3().setFromObject(object);
// 					scene.add( object );

// 				}, onprogress );

// 		} );


// CONTROL KEYS
const keysPressed = {  }
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key)
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
    } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
    }
}, false);
document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    (keysPressed as any)[event.key.toLowerCase()] = false
}, false);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition()
}
window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./textures/placeholder/wall.jpg");

    const WIDTH = 80
    const LENGTH = 80

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    placeholder.anisotropy = 32
    placeholder.repeat.set(50, 50)
    placeholder.wrapT = THREE.RepeatWrapping
    placeholder.wrapS = THREE.RepeatWrapping
    const material = new THREE.MeshPhongMaterial(
        {
            map: placeholder,
        })
    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2
    scene.add(floor)
}

function wrapAndRepeatTexture (map: THREE.Texture) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.repeat.x = map.repeat.y = 10
}

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.2))

    // const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    // dirLight.position.set(60, 100, -60);
    // dirLight.castShadow = true;
    // dirLight.shadow.camera.top = 50;
    // dirLight.shadow.camera.bottom = - 50;
    // dirLight.shadow.camera.left = - 50;
    // dirLight.shadow.camera.right = 50;
    // dirLight.shadow.camera.near = 0.1;
    // dirLight.shadow.camera.far = 200;
    // dirLight.shadow.mapSize.width = 4096;
    // dirLight.shadow.mapSize.height = 4096;
    // scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}