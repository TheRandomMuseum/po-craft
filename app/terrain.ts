import Vec3f from "./vec3f";

declare const gl: WebGLRenderingContext;

export default class Terrain {
    constructor(width, length) {
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

                terrain.scale = length / (terrain.rawWidth - 1);
                terrain.scaledWidth = (terrain.rawWidth - 1) * terrain.scale;
                terrain.scaledLength = (terrain.rawLength - 1) * terrain.scale;
                height /= terrain.scale;

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

                terrain.computeNormals();

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

    computeNormals() {
        if (this.normalsComputed) {
            return;
        }
    
        //Compute the rough version of the normals
        const normals: Vec3f[] = [];
        this.normals = [];
    
        for(let z = 0; z < this.rawLength; z++) {
            for(let x = 0; x < this.rawWidth; x++) {
                const sum: Vec3f = new Vec3f(0,0,0);
    
                let out : Vec3f;
                let inside : Vec3f;
                let left : Vec3f;
                let right: Vec3f;

                if (z > 0) {
                    out = new Vec3f(0, this.getHeight(x, z-1) - this.getHeight(x, z), -1.0);
                } else {
                    out = new Vec3f();
                }

                if (z < this.rawLength - 1) {
                    inside = new Vec3f(0, this.getHeight(x, z+1) - this.getHeight(x, z), 1);
                } else {
                    inside = new Vec3f();
                }

                if (x > 0) {
                    left = new Vec3f(-1, this.getHeight(x-1, z) - this.getHeight(x, z), 0);
                } else {
                    left = new Vec3f();
                }

                if (x < this.rawWidth - 1) {
                    right = new Vec3f(1, this.getHeight(x+1, z) - this.getHeight(x, z), 0);
                } else {
                    right = new Vec3f();
                }
    
                if (x > 0 && z > 0) {
                    sum.add(out.cross(left).normalize());
                }
                if (x > 0 && z < this.rawLength - 1) {
                    sum.add(left.cross(inside).normalize());
                }
                if (x < this.rawWidth - 1 && z < this.rawLength - 1) {
                    sum.add(inside.cross(right).normalize());
                }
                if (x < this.rawWidth - 1 && z > 0) {
                    sum.add(right.cross(out).normalize());
                }
    
                normals.push(sum);
            }
        }
    
        //Smooth out the normals
        const FALLOUT_RATIO = 0.5;
        for(let z = 0; z < this.rawLength; z++) {
            for(let x = 0; x < this.rawWidth; x++) {
                let sum = normals[this.offset(x, z)];
    
                if (x > 0) {
                    sum.add(normals[this.offset(x-1, z)].multiplyTo(FALLOUT_RATIO));
                }
                if (x < this.rawWidth-1) {
                    sum.add(normals[this.offset(x+1, z)].multiplyTo(FALLOUT_RATIO));
                }
                if (z > 0) {
                    sum.add(normals[this.offset(x, z-1)].multiplyTo(FALLOUT_RATIO));
                }
                if (z < this.rawLength - 1) {
                    sum.add(normals[this.offset(x, z+1)].multiplyTo(FALLOUT_RATIO));
                }
    
                if (sum.magnitude() == 0) {
                    sum = new Vec3f(0, 1, 0);
                }

                this.normals.push(sum);
            }
        }

        this.normalsComputed = true;
    }

    draw() {
        //glPushMatrix();
        // gl.disable(gl.TEXTURE_2D);
        // glColor3f(0.3f, 0.9f, 0.0f);
        // glScalef(scale, scale, scale);
        // for(let z = 0; z < this.rawLength - 1; z++) {
            // glBegin(GL_TRIANGLE_STRIP);
            // for(let x = 0; x < this.rawWidth; x++) {
                // let normal: Vec3f = this.getNormal(x, z);
                // glNormal3f(normal.x, normal.y, normal.z);
                // glVertex3f(x, this.getHeight(x, z), z);
                // normal = this.getNormal(x, z + 1);
                // glNormal3f(normal.x, normal.y, normal.z);
                // glVertex3f(x, this.getHeight(x, z + 1), z + 1);
            // }
            // glEnd();
        // }
    // #if 0
    //     /* Wireframe mode */
    //     glDisable(GL_LIGHTING);
    //     glColor3f(1.f, 1.f, 1.f);
    //     glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    //     for(int z = 0; z < rawLength() - 1; z++) {
    //         glBegin(GL_TRIANGLE_STRIP);
    //         for(int x = 0; x < rawWidth(); x++) {
    //             glVertex3f(x, getHeight(x, z)+.1, z);
    //             glVertex3f(x, getHeight(x, z + 1)+.1, z + 1);
    //         }
    //         glEnd();
    //     }
    //     glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
    //     glEnable(GL_LIGHTING);
    // #endif
        // glPopMatrix();
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
    scale: number = 1;
    scaledWidth: number;
    scaledLength: number;
}