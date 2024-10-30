import {EmptyObject} from "./EmptyObject.js";
import {defaultAttributeLocations} from "../GL Helpers/ShaderSource.js";
import {pbrMetallicRoughness} from "./Material.js";

export class Object3D extends EmptyObject{
    mesh;
    material;

    #vao;
    #shader;

    static objectTags = Object.freeze({
        Default     : 0,
        Portal      : 1,
    });

    constructor(mesh, shader, material, tag) {
        super();
        this.mesh = mesh;
        this.#shader = shader;
        this.material = material ?? pbrMetallicRoughness.defaultMaterial();

        this.#vao = mesh.getBufferedState(defaultAttributeLocations);
        this.tag = Object.values(Object3D.objectTags).includes(tag) ? tag : Object3D.objectTags.Default;
    }

    updateUniforms(){
        gl.uniformMatrix4fv(this.#shader.uniforms.world, false, this.transform.worldMatrix.glify);
    }

    drawObject(){
        gl.useProgram(this.#shader.program);
        gl.bindVertexArray(this.#vao);
        this.material.useMaterial(this.#shader);
        gl.uniform1i(this.#shader.uniforms.dontShade, this.tag === Object3D.objectTags.Portal? 1 : 0);

        this.updateUniforms();
        if(this.mesh.useIndex) {
            gl.drawElements(gl.TRIANGLES, this.mesh.drawCount, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.mesh.drawCount);
        }
    }
}