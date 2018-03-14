import * as delay from "delay";
import Game from "./game";

declare const gl: WebGLRenderingContext;

const TIMER_MS = 25;
const TERRAIN_WIDTH = 100;

export default class Engine {
    needDraw: boolean = true;
    game: Game = new Game();

    async launch() {
        console.log("launching");
        await this.init();
        
        this.renderLoop();
    }
    
    async init() {
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 191/255, 1, 1);

        // glEnable(GL_DEPTH_TEST);
        // glEnable(GL_LIGHTING);
        // glEnable(GL_LIGHT0);
        // glEnable(GL_NORMALIZE);
        // glEnable(GL_COLOR_MATERIAL);
        // glClearColor(0, 191.f/255, 1.f, 1.f);
        // glShadeModel(GL_SMOOTH);

        await this.game.loadTerrain("images/maps/heightmap.png", 15, TERRAIN_WIDTH)
    }

    async renderLoop() {
        this.addTimer(TIMER_MS, () => this.update());
        this.drawScene();

        while (1) {
            this.dealWithTimers();
            if (this.needDraw) {
                this.drawScene();
                this.needDraw = false;
            }
            await this.waitForTimers();
        }
    }

    update() {
        // gb->game.update(time);
        this.needDraw = true;
        this.addTimer(TIMER_MS, () => this.update());
    }

    drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // gb->game.draw();
        // gb->window.pushGLStates();
        // if (gb->menu.running()) {
        //     gb->menu.draw();
        // }
        // gb->window.popGLStates();
        // gb->window.display();
    }

    async waitForTimers() {
        if (this.timers.length === 0) {
            return await delay(1);
        }
        const now = Date.now();
        const nextTimer = this.timers[0];

        if (now < nextTimer.timeExpected) {
            await delay(nextTimer.timeExpected - now);
        }
    }

    addTimer(delay: number, funct: (delta: number) => any) {
        const now = Date.now();
        this.timers.push({
            timeStarted: now,
            timeExpected: now + delay,
            function: funct
        });
    }

    dealWithTimers() {
        while (this.timers.length > 0 && this.timers[0].timeExpected <= Date.now()) {
            const timer = this.timers.shift();
            timer.function(timer.timeExpected-timer.timeStarted);
        }
    }

    timers: Array<{
        timeStarted: number;
        timeExpected: number;
        function: (delta: number) => any;
    }> = [];
}