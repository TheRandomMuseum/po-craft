import * as delay from "delay";
import Engine from "./engine";

export async function launch() {
    await delay(1);

    const engine = new Engine();
    (window as any).engine = engine;

    engine.launch();
}