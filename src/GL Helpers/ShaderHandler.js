import {PBRShaderSource, basicShaderSource} from "./ShaderSource.js";

/**
 * Contains and manages shaders
 */
export class ShaderHandler {
    #attributes = {};
    #uniforms = {};

    constructor({vs, fs, attributes = {}, uniforms = {}}) {
        let vertexShader = ShaderHandler.#createShader(gl.VERTEX_SHADER, vs);
        let fragmentShader = ShaderHandler.#createShader(gl.FRAGMENT_SHADER, fs);

        this.program = ShaderHandler.#createProgram(vertexShader, fragmentShader);

        Object.keys(attributes).forEach(entry => attributes[entry].location = gl.getAttribLocation(this.program, attributes[entry].location));
        this.#attributes = attributes;

        this.#uniforms = Object.fromEntries(Object.entries(uniforms).map(([key, value]) => [key, gl.getUniformLocation(this.program, value)]));
    }

    get attributes(){
        return this.#attributes;
    }
    get uniforms(){
        return this.#uniforms;
    }

    static #createShader(type, source){
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            return shader
        }
        throw new Error(`Shader loading failed: ${gl.getShaderInfoLog(shader)}`);
    }

    static #createProgram(vs, fs){
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
            return program
        }
        throw new Error(`Program loading failed: ${gl.getProgramInfoLog(program)}`);
    }

    bindAttributes(buffers){
        Object.entries(this.#attributes).forEach(function (attribute){
            const value = attribute[1];
            gl.enableVertexAttribArray(value.location);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers[attribute[0]]);
            gl.vertexAttribPointer(value.location, value.size, value.type, false, 0, 0);
        });
    }
}

export const basicShader = new ShaderHandler(basicShaderSource);
export const PBRShader = new ShaderHandler(PBRShaderSource);
