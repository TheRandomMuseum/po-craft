import * as THREE from "three";
import Terrain from "./terrain";
declare const gl: WebGLRenderingContext;

export default class Camera extends THREE.PerspectiveCamera {
    constructor() {
        super(75, window.innerWidth / window.innerHeight);

        this.position.set(-40,2,-40);
        this.lookAt(0,0,0);

        window.addEventListener("mousemove", event => this.handleMouseMove(event.movementX, event.movementY));
        window.addEventListener("wheel", event => this.handleMouseScroll(event.deltaY));
    }

    update(time) {

    }

    handleMouseMove(dx, dy) {
        this.angleX += dx * 0.3;
        this.angleY += dy * 0.3;

        [this.angleX, this.angleY] = [this.angleX % 360, this.angleY % 360];
    }

    handleMouseScroll(zoom) {
        this._zoom += zoom;

        this._zoom = Math.max(Math.min(this._zoom, 50), 2);
    }
    
    angleX = 10;
    angleY = 135;
    _zoom = 12;
}