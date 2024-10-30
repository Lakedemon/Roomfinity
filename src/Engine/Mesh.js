import {Vector2, Vector3} from "../Math/index.js";

export class Mesh {
    static typeCount = Object.freeze({
        VEC4: 4,
        VEC3: 3,
        VEC2: 2,
        SCALAR: 1,
    })

    #POSITION;
    #NORMAL;
    #TEXCOORD_0;
    #index;

    constructor(position, normal, texcoord_0, index) {
        this.#POSITION = Mesh.#ifArrayTypedArray(position);
        this.#NORMAL = Mesh.#ifArrayTypedArray(normal);
        this.#TEXCOORD_0 = Mesh.#ifArrayTypedArray(texcoord_0);
        this.#index = Mesh.#ifArrayTypedArray(index, Uint16Array);
    }

    get useIndex() {
        return Boolean(this.#index);
    }

    get drawCount() {
        return this.useIndex ? this.#index.length : this.#POSITION.length;
    }

    get boundingBox(){
        function leftFillNum(num, targetLength) {
            return num.toString(2).padStart(targetLength, 0).split('');
        }

        function everyNthElement(arr, n, offset) {
            return arr.filter((_, index) => (index - offset) % n === 0);
        }


        const sortedCoordinates = [0, 1, 2].map(offset => everyNthElement(this.#POSITION, 3, offset));
        const minMax = sortedCoordinates.map(arr => ([Math.min(...arr),  Math.max(...arr)]));
        return Array.from({length:8}, (_,i) => new Vector3(...minMax.map((item, index) => item[leftFillNum(i, 3)[index]])));
    }

    boundingRadius(axisFilter = Vector3.one()){
        return Math.max(...this.boundingBox.map(point => point.multiply(axisFilter)).map((point, index, arr) => index + 1 === arr.length ? 0 : Vector3.distance(point, arr[index + 1]))) * 0.5;
    }

    static #bufferData(data, dataType, location, target = gl.ARRAY_BUFFER) {
        if (!data) {
            return -1;
        }

        const buffer = gl.createBuffer();
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, gl.STATIC_DRAW);

        if (location === undefined) {
            return buffer;
        }

        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, dataType, gl.FLOAT, false, 0, 0);
    }

    getBufferedState(locations) {
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        Mesh.#bufferData(this.#POSITION, Mesh.typeCount.VEC3, locations.POSITION);
        Mesh.#bufferData(this.#NORMAL, Mesh.typeCount.VEC3, locations.NORMAL);
        Mesh.#bufferData(this.#TEXCOORD_0, Mesh.typeCount.VEC2, locations.TEXCOORD_0);
        Mesh.#bufferData(this.#index, Mesh.typeCount.SCALAR, undefined, gl.ELEMENT_ARRAY_BUFFER);
        return vao;
    }

    static #ifArrayTypedArray(data, arrayType = Float32Array) {
        if (data instanceof arrayType) {
            return data
        } else if (Array.isArray(data) && data.length !== 0) {
            return new arrayType(data)
        } else {
            return undefined;
        }
    }
}