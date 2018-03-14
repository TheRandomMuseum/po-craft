import Terrain from "./terrain";

declare const gl: WebGLRenderingContext;

export default class Camera {
    angleX = 10;
    angleY = 135;
    _zoom = 12;

    project (terrain: Terrain) {
        // glTranslatef(0, 0, - terrain.width());
        // glRotatef(30, 1, 0, 0);
        // glRotatef(angleX, 1, 0, 0);
        // glRotatef(angleY, 0, 1, 0);
        // glTranslatef(-terrain.width() / 2, 0, -terrain.width() / 2);
    }
}