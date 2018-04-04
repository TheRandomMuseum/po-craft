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
        }
    }

    static async load(path: string, height: number, side: number): Promise<Terrain> {
        const image = new Image();
        image.src = path;

        return new Promise<Terrain>((resolve, reject)=> {
            image.onload = () => {
                console.log("onload");
                const terrain = new Terrain(image.width, image.height);

                terrain.aspect = side / (terrain.rawWidth - 1);
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
                        const color = imageData.data[(y * image.width + x) * 4];
                        const h = height * (color/255 - 0.5);
                        terrain.setHeight(x, y, h);
                    }
                }

                console.log("heights set");

                terrain.generateVertices();
                terrain.generateFaces();

                terrain.computeFaceNormals();
                terrain.computeVertexNormals();

                console.log("normals computed");

                console.log(terrain.scaledWidth, terrain.scaledLength);
                console.log(terrain.vertices.slice(0, 5));

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
                this.vertices.push(new Vector3(x * this.aspect, this.getHeight(x, z), z * this.aspect));
            }
        }
    }

    generateFaces() {
        for (let z = 0; z < this.rawLength - 1; z++) {
            for (let x = 0; x < this.rawWidth - 1; x ++) {
                // We need to get the index of the vertices
                // Two faces, to make a square: ((x,z), (x+1, z), (x, z+1))
                // and: ((x+1,z+1), (x+1, z), (x, z+1))
                const face1 = new Face3(this.offset(x, z), this.offset(x, z+1), this.offset(x+1, z));
                const face2 = new Face3(this.offset(x+1, z), this.offset(x, z+1), this.offset(x+1, z+1));
                this.faces.push(face1, face2);
            }
        }
    }

    setHeight(x: number, z: number, y: number) {
        this.heights[this.offset(x, z)] = y;
    }

    getHeight(rawX: number, rawZ: number) {
        return this.heights[this.offset(rawX, rawZ)];
    }

    offset(rawX: number, rawZ: number) {
        return rawZ * this.rawWidth + rawX;
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

    heightAt(x: number, z: number) {
        x = Math.max(Math.min(x/this.aspect, this.rawWidth-1), 0);
        z = Math.max(Math.min(z/this.aspect, this.rawLength-1), 0);

        // debugger;

        // We find the square containing x/z:
        const xTrunc = Math.min(Math.floor(x), this.rawWidth-1);
        const zTrunc = Math.min(Math.floor(z), this.rawLength-1);

        // We find which of the two triangles contains x/z
        const [xFrac, zFrac, xCeil, zCeil] = [x-xTrunc, z-zTrunc, xTrunc+1, zTrunc+1];
        const face = this.faces[this.faceOffset(xTrunc, zTrunc, xFrac+zFrac > 1)];

        /* First we check if the point is in the first triangle
            or the second triangle. This is done by fracX + fracZ
            being more or less than 1.

            Then we get the plane equation corresponding to the triangle,
            and use it to get the y coordinate of the point knowing x and z */
        // TODO: Check equations
        let normal: Vector3;
        let plane: number;
        if (xFrac + zFrac <= 1) {
            const mh = this.getHeight(xTrunc, zTrunc);

            normal = new Vector3(1, this.getHeight(xCeil, zTrunc) - mh, 0).cross(new Vector3(0, this.getHeight(xTrunc, zCeil)-mh, 1));
            plane = normal.dot(new Vector3(xTrunc, mh, zTrunc));
        } else {
            const mh = this.getHeight(xCeil, zCeil);
            
            normal = new Vector3(1, mh - this.getHeight(xTrunc, zCeil), 0).cross(new Vector3(0, mh - this.getHeight(xCeil, zTrunc), 1));
            plane = -normal.dot(new Vector3(xCeil, mh, zCeil));
        }

        return (-normal.x*x-normal.z*z-plane)/normal.y;
    }

    faceAt(x: number, z: number) : Face3 {
        x = Math.max(Math.min(x/this.aspect, this.rawWidth-1), 0);
        z = Math.max(Math.min(z/this.aspect, this.rawLength-1), 0);

        // We find the square containing x/z:
        const xTrunc = Math.min(Math.floor(x), this.rawWidth-1);
        const zTrunc = Math.min(Math.floor(z), this.rawLength-1);

        // We find which of the two triangles contains x/z
        const [xFrac, zFrac] = [x-xTrunc, z-zTrunc];

        return this.faces[this.faceOffset(x, z, xFrac + zFrac > 1)];
    }

    faceOffset(rawX: number, rawZ: number, secondTriangle: boolean): number {
        return this.offset(rawX, rawZ) * 2 + (secondTriangle ? 1 : 0);
    }

    w: number;
    l: number;
    heights: number[] = [];
    aspect: number = 1;
    private scaledWidth: number;
    private scaledLength: number;
}