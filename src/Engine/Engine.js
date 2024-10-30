import {SceneGraph} from "./SceneGraph.js";

export class Engine {
    #timer = 0;
    activeScene;

    constructor(mainShader, scene) {
        window.gl = canvas.getContext("webgl2", {stencil:true});
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.activeScene = scene ?? new SceneGraph(mainShader);
        this.update = new Event("update");
    }

    start() {
        this.#renderLoop();
    }

    #renderLoop() {
        this.#resizeCanvas();

        this.#updateTime();
        this.activeScene.updateScene();
        this.activeScene.portalDraw();

        window.requestAnimationFrame(this.#renderLoop.bind(this));
        window.dispatchEvent(this.update);
    }

    #resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        this.activeScene.mainCamera.resetProjection();
    }

    #updateTime() {
        let now = Date.now();
        window.deltaTime = this.#timer - now;
        this.#timer += deltaTime;
    }
}


