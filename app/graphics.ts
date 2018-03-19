declare const gl: WebGLRenderingContext;

export default class Graphics {
    constructor() {
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 191/255, 1, 1);

        // glEnable(GL_DEPTH_TEST);
        // glEnable(GL_LIGHTING);
        // glEnable(GL_LIGHT0);
        // glEnable(GL_NORMALIZE);
        // glEnable(GL_COLOR_MATERIAL);
        // glClearColor(0, 191.f/255, 1.f, 1.f);
        // glShadeModel(GL_SMOOTH);

        // await this.game.loadTerrain("images/maps/heightmap.png", 15, TERRAIN_WIDTH)
    }

    clear() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
