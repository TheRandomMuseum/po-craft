import { Vector3, Geometry, SphereGeometry, Mesh, MeshStandardMaterial } from "three";
import Terrain from "./terrain";

export default class Ball extends Mesh {
    terrain: Terrain = null;
    velocity: Vector3 = new Vector3(0, 0, 0);

    constructor(public radius: number) {
        super(new SphereGeometry(radius), new MeshStandardMaterial({color: 0xccff99}));

        this.position.set(radius, radius, radius);
    }

    setTerrain(terrain: Terrain) {
        this.terrain = terrain;

        this.advance(0);
    }

    checkPos() {
        const [radius, pos] = [this.radius, this.position];
        if (pos.x < radius) {
            pos.setX(radius);
        }

        if (pos.z < radius) {
            pos.setZ(radius);
        }

        if (this.terrain) {
            if (pos.x + radius > this.terrain.width) {
                pos.setX(this.terrain.width-radius);
            }

            if (pos.z + radius > this.terrain.length) {
                pos.setZ(this.terrain.length-radius);
            }
        }
    }

    advance(delta: number) {
        this.position.set(
            this.position.x + this.velocity.x * delta, 
            this.position.y + this.velocity.y * delta,
            this.position.z + this.velocity.z * delta
        );

        this.checkPos();

        if (this.terrain) {
            // Todo: improve
            this.position.setY(this.terrain.heightAt(this.position.x, this.position.z) + this.radius);
        } else {
            this.position.setY(this.radius);
        }
    }
}