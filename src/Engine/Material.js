import {Vector3} from "../Math/index.js";

export class pbrMetallicRoughness{
    baseColorFactor;
    roughnessFactor;
    metallicFactor;

    constructor(baseColor = Vector3.one(), roughness = 0.5, metallic = 0) {
        this.baseColorFactor = baseColor;
        this.roughnessFactor = roughness;
        this.metallicFactor = metallic;
    }

    static defaultMaterial(){
        return new pbrMetallicRoughness();
    }

    useMaterial(shader){
        gl.uniform3f(shader.uniforms.baseColor, ...this.baseColorFactor);
        gl.uniform1f(shader.uniforms.roughness, this.roughnessFactor);
        gl.uniform1f(shader.uniforms.metallic, this.metallicFactor);
    }
}