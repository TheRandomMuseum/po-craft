import * as THREE from "three";
import Terrain from "./terrain";
import { Geometry, Vector3 } from "three";
declare const gl: WebGLRenderingContext;

const TO_RAD = Math.PI / 180;

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

    study(point: Vector3) {
        const x = point.x - this._zoom * Math.cos(this.angleX * TO_RAD) * Math.cos(this.angleY * TO_RAD);
        const y = point.y + this._zoom * Math.sin(this.angleY * TO_RAD);
        const z = point.z + this._zoom * Math.sin(this.angleX * TO_RAD) * Math.cos(this.angleY * TO_RAD);
        this.position.set(x, y, z);
        console.log(this.angleX, this.angleY, this._zoom);
        this.lookAt(point);
    }
    
    angleX = 135;
    angleY = 144;
    _zoom = 12;
}