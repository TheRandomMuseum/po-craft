import * as delay from "delay";

declare const gl: WebGLRenderingContext;

const TIMER_MS = 25;

export default class Engine {
    needDraw: boolean = true;

    launch() {
        this.init();
        this.renderLoop();
    }
    
    init() {
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 191/255, 1, 1);
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