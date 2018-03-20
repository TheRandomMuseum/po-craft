import Terrain from "./terrain";
import Camera from "./camera";
import {CameraMode, Dir} from "./enums";
import Graphics from "./graphics";
import * as THREE from "three";

export default class Game {
    cube: THREE.Mesh;

    constructor(public graphics: Graphics){
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshStandardMaterial( { color: 0xccff99 } );
        this.cube = new THREE.Mesh( geometry, material );
        graphics.scene.add( this.cube );

        const ambientLight = new THREE.AmbientLight(new THREE.Color(0.4,0.4,0.4));
        graphics.scene.add(ambientLight);

        const pointLight = new THREE.DirectionalLight(new THREE.Color(0.6,0.6,0.6));
        pointLight.position.set(-0.5, 0.8, 0.1);
        graphics.scene.add(pointLight);
    }

    async loadTerrain(path: string, height: number, length: number) {
        this.terrain = await Terrain.load(path, height, length);
        const material = new THREE.MeshLambertMaterial({color: new THREE.Color(0.3,0.9,0)});
        const object = new THREE.Mesh(this.terrain, material);
        //object.matrixAutoUpdate = false;
        this.graphics.scene.add(object);

        console.log("terrain loaded");
    }

    draw() {
        if (!this.terrain) {
            return;
        }

        if (this.cameraMode == CameraMode.OnTerrain) {
            this.camera.project(this.terrain);
        } else if (this.cameraMode == CameraMode.OnCharacter){
            // camera.project(ball);
        } else if (this.cameraMode == CameraMode.BehindCharacter) {
            // camera.projectBehind(ball);
        }
    
        if (this.cameraMode != CameraMode.OnCharacter) {
            // ball.draw();
        }
    }

    update(time: number) {
        this.cube.rotation.x += 0.0007*time;
        this.cube.rotation.y += 0.0007*time;

        // this.graphics.camera.position.set(200,200,200);
        // this.graphics.camera.lookAt(0,0,0);
    }

    xDir = 0;
    zDir = 0;
    cameraMode: CameraMode = CameraMode.BehindCharacter;
    cameraRotateDirectionX: Dir = Dir.Center;
    cameraRotateDirectionY: Dir = Dir.Center;
    cameraZoomDirection: Dir = Dir.Center;
    terrain: Terrain;
    camera = new Camera();
}