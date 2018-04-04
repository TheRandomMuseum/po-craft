import Terrain from "./terrain";
import Camera from "./camera";
import Ball from "./ball";
import {CameraMode, Dir} from "./enums";
import Graphics from "./graphics";
import * as THREE from "three";
import { Geometry, Vector3, Face3 } from "three";

export default class Game {
    constructor(public graphics: Graphics){
        const ambientLight = new THREE.AmbientLight(new THREE.Color(0.4,0.4,0.4));
        graphics.scene.add(ambientLight);

        const pointLight = new THREE.DirectionalLight(new THREE.Color(0.6,0.6,0.6));
        pointLight.position.set(-0.5, 0.8, 0.1);
        graphics.scene.add(pointLight);

        graphics.scene.add(this.ball);
    }

    async init() {
        await this.loadTerrain("images/maps/heightmap.png", 15, 100);
    }

    async loadTerrain(path: string, height: number, length: number) {
        this.terrain = await Terrain.load(path, height, length);
        const material = new THREE.MeshLambertMaterial({color: new THREE.Color(0.3,0.9,0)});
        const object = new THREE.Mesh(this.terrain, material);
        object.matrixAutoUpdate = false;
        this.graphics.scene.add(object);

        this.ball.setTerrain(this.terrain);

        console.log("terrain loaded");
    }

    draw() {
        if (!this.terrain) {
            return;
        }

        if (this.cameraMode == CameraMode.OnTerrain) {
            // this.camera.project(this.terrain);
            this.graphics.camera.study(new Vector3(this.terrain.width/2, this.terrain.heightAt(this.terrain.width/2, this.terrain.length/2), this.terrain.length/2));
        } else if (this.cameraMode == CameraMode.OnCharacter){
            // camera.project(ball);
        } else if (this.cameraMode == CameraMode.BehindCharacter) {
            this.graphics.camera.study(this.ball.position);
            // camera.projectBehind(ball);
        }
    
        if (this.cameraMode != CameraMode.OnCharacter) {
            // ball.draw();
        }
    }

    update(time: number) {
        this.graphics.camera.update(time);
    }

    xDir = 0;
    zDir = 0;
    cameraMode: CameraMode = CameraMode.BehindCharacter;
    cameraRotateDirectionX: Dir = Dir.Center;
    cameraRotateDirectionY: Dir = Dir.Center;
    cameraZoomDirection: Dir = Dir.Center;
    terrain: Terrain;
    ball: Ball = new Ball(0.4);
    camera = new Camera();
}