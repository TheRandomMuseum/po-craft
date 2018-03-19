import * as delay from "delay";
import Game from "./game";
import Graphics from "./graphics";

const TIMER_MS = 25;
const TERRAIN_WIDTH = 100;

export default class Engine {
    needDraw: boolean = true;
    game: Game = null;
    graphics: Graphics = null;

    async launch() {
        await this.init();
        
        this.renderLoop();
    }
    
    async init() {
        this.graphics = new Graphics();
        this.game = new Game(this.graphics);
    }

    async renderLoop() {
        this.addTimer(TIMER_MS, (delta) => this.update(delta));
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

    update(delta: number) {
        this.game.update(delta);
        this.needDraw = true;
        this.addTimer(TIMER_MS, (delta) => this.update(delta));
    }

    drawScene() {
        this.graphics.draw();
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
        const timer = {
            timeStarted: now,
            timeExpected: now + delay,
            function: funct
        };

        for (let i = this.timers.length; i >= 0; i--) {
            if (i == 0 || this.timers[i-1].timeExpected <= timer.timeExpected) {
                this.timers.splice(i, 0, timer);
            }
        }
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