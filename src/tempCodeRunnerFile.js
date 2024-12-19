import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

// Set the default background color to #F6D6D6
scene.background = new THREE.Color('#F6D6D6')

/**
 * GUI Controls for Background Color
 */
const params = {
    backgroundColor: '#F6D6D6' // Default color in hexadecimal
}

gui.addColor(params, 'backgroundColor').onChange((value) => {
    scene.background.set(value) // Update the scene's background color
})

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Load multiple matcap textures for selection
const matcapTextures = {
    'Matcap 1': textureLoader.load('textures/matcaps/1.png'),
    'Matcap 2': textureLoader.load('textures/matcaps/2.png'),
    'Matcap 3': textureLoader.load('textures/matcaps/3.png'),
    'Matcap 4': textureLoader.load('textures/matcaps/4.png')
}

// Default texture selection
let textMatcap = matcapTextures['Matcap 4']
let donutMatcap = matcapTextures['Matcap 4']

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // Material
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: textMatcap })
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: donutMatcap })

        // Text
        const textGeometry = new TextGeometry(
            'Sychae Enriquez',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }

        // GUI Controls for Matcap textures
        const params = {
            textMatcap: 'Matcap 8', // Default selection
            donutMatcap: 'Matcap 8' // Default selection
        }

        gui.add(params, 'textMatcap', Object.keys(matcapTextures)).onChange((value) => {
            textMaterial.matcap = matcapTextures[value] // Update the text material
        })

        gui.add(params, 'donutMatcap', Object.keys(matcapTextures)).onChange((value) => {
            donutMaterial.matcap = matcapTextures[value] // Update the donut material
        })
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
