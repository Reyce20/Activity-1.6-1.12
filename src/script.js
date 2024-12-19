import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * Scene
 */
const scene = new THREE.Scene();

// Set the default background color to #F6D6D6
scene.background = new THREE.Color('#F6D6D6');

/**
 * Parameters
 */
const params = {
    backgroundColor: '#F6D6D6',
    textMatcap: 'Matcap 8', 
    donutMatcap: 'Matcap 8', 
    textColor: '#ffffff',
    donutColor: '#ffffff',
    wireframeDonut: false,
    wireframeText: false,
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Load 8 matcap textures
const matcapTextures = {
    'Matcap 1': textureLoader.load('textures/matcaps/1.png'),
    'Matcap 2': textureLoader.load('textures/matcaps/2.png'),
    'Matcap 3': textureLoader.load('textures/matcaps/3.png'),
    'Matcap 4': textureLoader.load('textures/matcaps/4.png'),
    'Matcap 5': textureLoader.load('textures/matcaps/5.png'),
    'Matcap 6': textureLoader.load('textures/matcaps/6.png'),
    'Matcap 7': textureLoader.load('textures/matcaps/7.png'),
    'Matcap 8': textureLoader.load('textures/matcaps/8.png'),
};

// Default materials
let textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextures['Matcap 8'], color: params.textColor });
let donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextures['Matcap 8'], color: params.donutColor });

/**
 * GUI Controls
 */
gui.addColor(params, 'backgroundColor').name('Background Color').onChange((value) => {
    scene.background.set(value);
});

const textureFolder = gui.addFolder('Textures');
textureFolder.add(params, 'textMatcap', Object.keys(matcapTextures)).name('Text Texture').onChange((value) => {
    textMaterial.matcap = matcapTextures[value];
});
textureFolder.add(params, 'donutMatcap', Object.keys(matcapTextures)).name('Donut Texture').onChange((value) => {
    donutMaterial.matcap = matcapTextures[value];
});

const colorFolder = gui.addFolder('Colors');
colorFolder.addColor(params, 'textColor').name('Text Color').onChange((value) => {
    textMaterial.color.set(value);
});
colorFolder.addColor(params, 'donutColor').name('Donut Color').onChange((value) => {
    donutMaterial.color.set(value);
});

const wireframeFolder = gui.addFolder('Wireframes');
wireframeFolder.add(params, 'wireframeText').name('Text Wireframe').onChange((value) => {
    textMaterial.wireframe = value;
});
wireframeFolder.add(params, 'wireframeDonut').name('Donut Wireframe').onChange((value) => {
    donutMaterial.wireframe = value;
});

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    // Text
    const textGeometry = new TextGeometry('Sychae Enriquez', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    });
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);

    // Donuts
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, donutMaterial);
        donut.position.x = (Math.random() - 0.5) * 10;
        donut.position.y = (Math.random() - 0.5) * 10;
        donut.position.z = (Math.random() - 0.5) * 10;
        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;
        const scale = Math.random();
        donut.scale.set(scale, scale, scale);

        scene.add(donut);
    }
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();
