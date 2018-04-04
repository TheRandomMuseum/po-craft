import * as THREE from "three";
import Camera from "./camera";

export default class Graphics {
    scene: THREE.Scene;
    camera: Camera;
    renderer: THREE.WebGLRenderer;

    constructor() {
        // gl.enable(gl.DEPTH_TEST);
        // gl.clearColor(0, 191/255, 1, 1);

        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.onresize = event => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }

        this.renderer.setClearColor(new THREE.Color(0, 191/255, 1));

        // glShadeModel(GL_SMOOTH);
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }
}
