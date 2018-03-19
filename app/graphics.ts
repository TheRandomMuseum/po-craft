import * as THREE from "three";

export default class Graphics {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    constructor() {
        // gl.enable(gl.DEPTH_TEST);
        // gl.clearColor(0, 191/255, 1, 1);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.onresize = event => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
        }

        // glEnable(GL_DEPTH_TEST);
        // glEnable(GL_LIGHTING);
        // glEnable(GL_LIGHT0);
        // glEnable(GL_NORMALIZE);
        // glEnable(GL_COLOR_MATERIAL);
        // glClearColor(0, 191.f/255, 1.f, 1.f);
        // glShadeModel(GL_SMOOTH);

        // await this.game.loadTerrain("images/maps/heightmap.png", 15, TERRAIN_WIDTH)
    }

    clear() {
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    draw() {
        this.camera.position.z = 5;
        this.renderer.render(this.scene, this.camera);
    }
}
