import Vec3f from "./vec3f";
import { Geometry, Vector3, Face3 } from "three";
import * as THREE from "three";

export default class Terrain extends Geometry {
    constructor(width, length) {
        super();

        this.w = width;
        this.l = length;

        this.scaledWidth = width - 1;
        this.scaledLength = length - 1;
    
        for (let i = 0; i < width * length; i++) {
            this.heights.push(0);
            this.normals.push(new Vec3f(0,1,0));
        }    
    }

    static async load(path: string, height: number, length: number): Promise<Terrain> {
        const image = new Image();
        image.src = path;

        return new Promise<Terrain>((resolve, reject)=> {
            image.onload = () => {
                console.log("onload");
                const terrain = new Terrain(image.width, image.height);

                terrain.aspect = length / (terrain.rawWidth - 1);
                terrain.scaledWidth = (terrain.rawWidth - 1) * terrain.aspect;
                terrain.scaledLength = (terrain.rawLength - 1) * terrain.aspect;
                height /= terrain.aspect;

                const canvas = document.createElement("canvas");

                canvas.width = image.width;
                canvas.height = image.height;
                
                const context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(0, 0, image.width, image.height);
                for (let y = 0; y < image.height; y++) {
                    for (let x = 0; x < image.width; x++) {
                        const color = imageData[(y * image.width + x) * 4];
                        const h = height * (color/255 - 0.5);
                        terrain.setHeight(x, y, h);
                    }
                }

                console.log("heights set");

                terrain.generateVertices();
                terrain.generateFaces();

                terrain.computeVertexNormals();
                terrain.computeFaceNormals();

                console.log("normals computed");

                resolve(terrain);
            }

            image.onerror = err => {
                console.error(err);
                reject(err);
            }

            console.log("handlers set");
        });  
    }

    generateVertices() {
        for (let z = 0; z < this.rawLength; z++) {
            for (let x = 0; x < this.rawWidth; x++) {
                this.vertices.push(new Vector3(x, this.getHeight(x, z), z));
            }
        }
    }

    generateFaces() {
        for (let z = 0; z < this.rawLength - 1; z++) {
            for (let x = 0; x < this.rawWidth - 1; x ++) {
                // We need to get the index of the vertices
                // Two faces, to make a square: ((x,z), (x+1, z), (x, z+1))
                // and: ((x+1,z+1), (x+1, z), (x, z+1))
                const face1 = new Face3(this.offset(x, z), this.offset(x+1, z), this.offset(x, z+1));
                const face2 = new Face3(this.offset(x+1, z+1), this.offset(x+1, z), this.offset(x, z+1));
            }
        }
    }

    setHeight(x: number, z: number, y: number) {
        this.heights[this.offset(x, z)] = y;
        this.normalsComputed = false;
    }

    getHeight(x: number, z: number) {
        return this.heights[this.offset(x, z)];
    }

    getNormal(x: number, z: number) {
        return this.getNormal(x, z);
    }

    offset(x: number, z: number) {
        return z * this.rawWidth + x;
    }

    get width() {
        return this.scaledWidth;
    }

    get length() {
        return this.scaledLength;
    }

    get rawWidth() {
        return this.w;
    }

    get rawLength() {
        return this.l;
    }

    w: number;
    l: number;
    heights: number[] = [];
    normals: Vec3f[] = [];
    normalsComputed: boolean = false;
    aspect: number = 1;
    scaledWidth: number;
    scaledLength: number;
}