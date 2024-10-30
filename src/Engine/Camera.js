import {Transform} from "./Transform.js";
import {glMath, Matrix4, Vector3, Vector4} from "../Math/index.js";
import {EmptyObject} from "./EmptyObject.js";

export class Camera extends EmptyObject{
    projectionMatrix;

    constructor(fov, aspect, near, far) {
        super();
        this.projectionMatrix = Matrix4.perspective(glMath.toRad(fov), aspect, near, far);
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }

    get viewMat(){
        return Matrix4.fromTransform(this.transform, true);
    }

    get copy(){
        let newCopy = new Camera(this.fov, this.aspect, this.fov, this.far);
        newCopy.transform = this.transform.copy;
        return newCopy;
    }

    resetProjection(){
        this.projectionMatrix = Matrix4.perspective(glMath.toRad(this.fov),gl.canvas.clientWidth / gl.canvas.clientHeight, this.near, this.far);
    }

    /**
     * Calculates a 4D vector that represents a plane in camera space
     * Used as a clipping plane for frustum clipping
     * @param {Transform} plane - original transform of an object/plane in world space
     * @param {Matrix4} viewMat - camera space
     * @param {number} side - side
     * @returns {Vector4} - 4D plane in camera space
     */
    static clippingPlane(plane, viewMat, side){
        const pos = viewMat.multiplyPoint(plane.position);
        const normal = (Vector3.productS(viewMat.multiplyVector(plane.forward), side)).normalized;

        const dis = -Vector3.dot(pos, normal);
        return new Vector4(normal.x, normal.y, normal.z, dis);
    }

    relativeMirror(from, to){
        return this.viewMat.multiply(from).multiply(Matrix4.identity().rotateY(glMath.toRad(180))).multiply(to.inverse);
    }

    updateUniforms(shader){
        gl.uniformMatrix4fv(shader.uniforms.projection, false, this.projectionMatrix);
        gl.uniformMatrix4fv(shader.uniforms.view, false, this.viewMat.glify);
        gl.uniform3f(shader.uniforms.cameraPosition, ...this.transform.position);
    }
}