import Terrain from "./terrain";
import Camera from "./camera";
import {CameraMode, Dir} from "./enums";
import Graphics from "./graphics";
import * as THREE from "three";

export default class Game {
    cube: THREE.Mesh;

    constructor(public graphics: Graphics){
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        graphics.scene.add( this.cube );
    }

    async loadTerrain(path: string, height: number, length: number) {
        this.terrain = await Terrain.load(path, height, length);

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
    
        // GLfloat ambientColor[] = {0.4f, 0.4f, 0.4f, 1.0f};
        // glLightModelfv(GL_LIGHT_MODEL_AMBIENT, ambientColor);
    
        // GLfloat lightColor0[] = {0.6f, 0.6f, 0.6f, 1.0f};
        // GLfloat lightPos0[] = {-0.5f, 0.8f, 0.1f, 0.0f};
        // glLightfv(GL_LIGHT0, GL_DIFFUSE, lightColor0);
        // glLightfv(GL_LIGHT0, GL_POSITION, lightPos0);
    
        this.terrain.draw();
    
        if (this.cameraMode != CameraMode.OnCharacter) {
            // ball.draw();
        }
    }

    update(time: number) {
        this.cube.rotation.x += 0.0007*time;
        this.cube.rotation.y += 0.0007*time;
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