import {Vector3} from "./Vector3.js";
import {glMath} from "./glMath.js";
import {Vector4} from "./Vector4.js";

/**
 * Class that represents a 4x4 Matrix
 */
export class Matrix4 {
    /**
     * Create a Matrix4x4
     * @param {Array.<number>} entries - entries of the 4x4 matrix
     */
    constructor(entries) {
        if (entries.length !== 16) {
            throw new Error(`Matrix 4x4 must be of size 16, you provided ${entries.length}`);
        }
        this.entries = entries;
    }

    /**
     * Returns a position vector of this instance of Matrix4x4
     * @returns {Vector3} position vector
     */
    get position() {
        return new Vector3(this.entries[12], this.entries[13], this.entries[14]);
    }

    /**
     * Returns inverse of this instance of Matrix4x4
     * @returns {Matrix4} inverse matrix
     */
    get inverse() {
        const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33] = this.entries;
        const [
            tmp0, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9, tmp10, tmp11,
            tmp12, tmp13, tmp14, tmp15, tmp16, tmp17, tmp18, tmp19, tmp20, tmp21, tmp22, tmp23
        ] =
        [
            m22 * m33, m32 * m23, m12 * m33, m32 * m13, m12 * m23, m22 * m13, m02 * m33, m32 * m03, m02 * m23, m22 * m03, m02 * m13, m12 * m03,
            m20 * m31, m30 * m21, m10 * m31, m30 * m11, m10 * m21, m20 * m11, m00 * m31, m30 * m01, m00 * m21, m20 * m01, m00 * m11, m10 * m01,
        ];

        const t0 = tmp0 * m11 + tmp3 * m21 + tmp4 * m31 - (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
        const t1 = tmp1 * m01 + tmp6 * m21 + tmp9 * m31 - (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
        const t2 = tmp2 * m01 + tmp7 * m11 + tmp10 * m31 - (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
        const t3 = tmp5 * m01 + tmp8 * m11 + tmp11 * m21 - (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        return new Matrix4([d * t0, d * t1, d * t2, d * t3,
            d * (tmp1 * m10 + tmp2 * m20 + tmp5 * m30 - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)),
            d * (tmp0 * m00 + tmp7 * m20 + tmp8 * m30 - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)),
            d * (tmp3 * m00 + tmp6 * m10 + tmp11 * m30 - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)),
            d * (tmp4 * m00 + tmp9 * m10 + tmp10 * m20 - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)),
            d * (tmp12 * m13 + tmp15 * m23 + tmp16 * m33 - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)),
            d * (tmp13 * m03 + tmp18 * m23 + tmp21 * m33 - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)),
            d * (tmp14 * m03 + tmp19 * m13 + tmp22 * m33 - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)),
            d * (tmp17 * m03 + tmp20 * m13 + tmp23 * m23 - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)),
            d * (tmp14 * m22 + tmp17 * m32 + tmp13 * m12 - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)),
            d * (tmp20 * m32 + tmp12 * m02 + tmp19 * m22 - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)),
            d * (tmp18 * m12 + tmp23 * m32 + tmp15 * m02 - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)),
            d * (tmp22 * m22 + tmp16 * m02 + tmp21 * m12 - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02))
        ]);
    }

    get copy() {
        return new Matrix4([...this]);
    }

    /**
     * Returns a Float32Array representation of this instance of Matrix4x4
     * Preferred type of matrices when communicating to GPU through WebGL
     * @returns {Float32Array} typed array of matrix entries
     */
    get glify() {
        return new Float32Array(this.entries);
    }

    get transpose(){
        return new Matrix4([
            this.entries[0], this.entries[4], this.entries[8], this.entries[12],
            this.entries[1], this.entries[5], this.entries[9], this.entries[13],
            this.entries[2], this.entries[6], this.entries[10], this.entries[14],
            this.entries[3], this.entries[7], this.entries[11], this.entries[15],
        ]);
    }

    setRow(n, v){
        this.entries[n*4] = v.x;
        this.entries[n*4 + 1] = v.y;
        this.entries[n*4 + 2] = v.z;
        this.entries[n*4 + 3] = v.w;
    }

    getRow(n){
        return new Vector4(
            this.entries[n*4],
            this.entries[n*4 + 1],
            this.entries[n*4 + 2],
            this.entries[n*4 + 3],
        );
    }

    setColumn(n, v){
        this.entries[n] = v.x;
        this.entries[n + 4] = v.y;
        this.entries[n + 8] = v.z;
        this.entries[n + 12] = v.w;
    }

    getColumn(n){
        return new Vector4(
            this.entries[n],
            this.entries[n + 4],
            this.entries[n + 8],
            this.entries[n + 12],
        );
    }

    /*get left() {
        return new Vector3(this.entries[0], this.entries[1], this.entries[2]);
    }

    get up() {
        return new Vector3(this.entries[4], this.entries[5], this.entries[6]);
    }

    get forward() {
        return new Vector3(this.entries[8], this.entries[9], this.entries[10]);
    }

    get right() {
        return new Vector3(-this.entries[0], -this.entries[1], -this.entries[2]);
    }

    get down() {
        return new Vector3(-this.entries[4], -this.entries[5], -this.entries[6]);
    }

    get back() {
        return new Vector3(-this.entries[8], -this.entries[9], -this.entries[10]);
    }*/

    static identity() {
        return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    static zero() {
        return new Matrix4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    /**
     * Calculates product of two matrices
     * @param {Matrix4} a - Matrix a
     * @param {Matrix4} b - Matrix b
     * @returns {Matrix4} product of matrices a and b
     */
    static product(a, b) {
        const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = a.entries;
        const [b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33] = b.entries;

        return new Matrix4([
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]);
    }

    /**
     * Creates a perspective projection matrix
     * @param {number} fov - field of view in radians
     * @param {number} aspect - aspect ratio
     * @param {number} near - distance to the near plane
     * @param {number} far - distance to the far plane
     * @returns {Matrix4} perspective projection matrix
     */
    static perspective(fov, aspect, near, far) {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        const rangeInv = 1.0 / (near - far);

        return new Matrix4([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, 2 * far * near * rangeInv, 0,
        ]);
    }

    /**
     * Creates a view matrix that focused on point
     * @param {Vector3} eye - origin of the view
     * @param {Vector3} target - target position the view is focused on
     * @param {Vector3} up - upward vector relative to the view
     * @returns {Matrix4} look at matrix
     */
    static lookAt(eye, target, up) {
        const forward = Vector3.difference(eye, target).normalized;
        const right = Vector3.cross(up, forward).normalized;
        const y = Vector3.cross(forward, right).normalized;

        return new Matrix4([
            right.x, right.y, right.z, 0,
            y.x, y.y, y.z, 0,
            forward.x, forward.y, forward.z, 0,
            eye.x, eye.y, eye.z, 1
        ]);
    }

    /**
     * Creates a translation matrix
     * @param {number} x - translation along x-axis
     * @param {number} y - translation along y-axis
     * @param {number} z - translation along z-axis
     * @returns {Matrix4} translation matrix
     */
    static #translation({x, y, z}) {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ]);
    }

    /**
     * Creates a rotation matrix along x axis
     * @param {number} r - rotation in degrees
     * @returns {Matrix4} rotation matrix
     */
    static #rotationX(r) {
        const c = Math.cos(r);
        const s = Math.sin(r);

        return new Matrix4([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Creates a rotation matrix along y axis
     * @param {number} r - rotation in degrees
     * @returns {Matrix4} rotation matrix
     */
    static #rotationY(r) {
        const c = Math.cos(r);
        const s = Math.sin(r);

        return new Matrix4([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Creates a rotation matrix along z axis
     * @param {number} r - rotation in degrees
     * @returns {Matrix4} rotation matrix
     */
    static #rotationZ(r) {
        const c = Math.cos(r);
        const s = Math.sin(r);

        return new Matrix4([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Creates a scaling matrix
     * (word scalation was used for aesthetic reasons, translATION rotATION, scalATION...)
     * @param {number} x - scaling along x-axis
     * @param {number} y - scaling along y-axis
     * @param {number} z - scaling along z-axis
     * @returns {Array.<number>} scaling matrix
     */
    static #scalation({x, y, z}) {
        return new Matrix4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ]);
    }

    static fromTransform({position, rotation, scale}, inverse = false) {
        const [tx, ty, tz] = position;
        const [rx, ry, rz] = rotation;
        const [sx, sy, sz] = scale;

        const c = Math.cos(rx);
        const s = Math.sin(rx);

        const a = Math.cos(ry);
        const b = Math.sin(ry);

        const q = Math.cos(rz);
        const w = Math.sin(rz);

        const bs = b * s;
        const cq = c * q;
        const cw = c * w;

        if(inverse) {
            const [i, o, p] = [1/sx, 1/sy, 1/sz];

            const ap = a*p;

            const m00 = a*q*i;
            const m10 = (cw+bs*q) * i;
            const m20 = (w*s-b*cq) * i;

            const m01 = a*o*w;
            const m11 = (cq-bs*w) * o;
            const m21 = (b*cw+q*s) * o;

            const m02 = b*p;
            const m12 = ap*s;
            const m22 = ap*c;

            return new Matrix4([
                m00, m10, m20, 0,
                -m01, m11, m21, 0,
                m02, -m12, m22, 0,
                m01 * ty - m02 * tz - m00 * tx, m12 * tz - m11 * ty - m10 * tx, -m21 * ty - m22 * tz - m20 * tx, 1
            ]);
        } else {
            return new Matrix4([
                a * q * sx, -a * w * sx, b * sx, 0,
                (cw + bs * q) * sy, (cq - bs * w) * sy, -a * s * sy, 0,
                (s * w - cq * b) * sz, (cw * b + s * q) * sz, c * a * sz, 0,
                tx, ty, tz, 1
            ]);
        }
    }

    get size(){
        return new Vector3(
            new Vector3(this.entries[0], this.entries[1], this.entries[2]).magnitude,
            new Vector3(this.entries[4], this.entries[5], this.entries[6]).magnitude,
            new Vector3(this.entries[8], this.entries[9], this.entries[10]).magnitude,
        );
    }

    get rotation() {
        const [sx, sy, sz] = this.size;

        let y = Math.atan((-this.entries[8] * sx)/(this.entries[10] * sz));
        y = this.entries[10] < 0 && this.entries[8] > 0 ? y - Math.PI : this.entries[10] < 0 && this.entries[8] < 0 ? y + Math.PI : y;

        return new Vector3(
            Math.asin(this.entries[9] / sy),
            y,
            Math.atan(-this.entries[1]/this.entries[5]),
        );
    }

    toTransform(transform) {
        transform.position = this.position;
        transform.scale = this.size;
        transform.rotation = this.rotation;
    }

    relativeMirrorMatrix(relativeTo, mirrorFrom){
        return relativeTo.inverse.multiply(mirrorFrom.multiply(this));
    }

    /**
     *
     * @param {Vector4} clipPlane
     * @returns {Matrix4}
     */
    clipProjectionMatrix(clipPlane)
    {
        const vcamera = new Vector4(
            (Math.sign(clipPlane.x) - this.entries[8]) / this.entries[0],
            (Math.sign(clipPlane.y) - this.entries[9]) / this.entries[5],
            1,
            (this.entries[10] / this.entries[14])
        )
        const n = -1 / Vector4.dot(clipPlane, vcamera);

        this.entries[2] = n * clipPlane.x;
        this.entries[6] = n * clipPlane.y;
        this.entries[10] = n * clipPlane.z + 1;
        this.entries[14] = n * clipPlane.w;
    }

    clipRevProjectionMatrix(clipPlane)
    {
        const vcamera = new Vector4(
            (Math.sign(clipPlane.x) - this.entries[8]) / this.entries[0],
            (Math.sign(clipPlane.y) - this.entries[9]) / this.entries[5],
            1,
            ((1 - this.entries[10]) / this.entries[14])
        )
        const n = 1 / Vector4.dot(clipPlane, vcamera);

        this.entries[2] = n * clipPlane.x;
        this.entries[6] = n * clipPlane.y;
        this.entries[10] = n * clipPlane.z;
        this.entries[14] = n * clipPlane.w;
    }

    /**
     * Multiplies this instance of Matrix4x4 by a matrix
     * @param {Matrix4} m - matrix to multiply by
     */
    multiply(m) {
        this.entries = Matrix4.product(this, m).entries;
        return this;
    }

    /**
     * Matrix by vector
     * @param {Vector4} v
     * @returns {Vector4}
     */
    multiplyByVector(v)
    {
        const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33] = this.entries;
        return new Vector4(
            m00 * v.x + m01 * v.y + m02 * v.z + m03 * v.w,
            m10 * v.x + m11 * v.y + m12 * v.z + m13 * v.w,
            m20 * v.x + m21 * v.y + m22 * v.z + m23 * v.w,
            m30 * v.x + m31 * v.y + m32 * v.z + m33 * v.w,
        );
    }

    /**
     * Vector(direction) by matrix
     * @param v
     * @returns {Vector3}
     */
    multiplyVector(v){
        const [m00, m01, m02, , m10, m11, m12, , m20, m21, m22, ,] = this.entries;
        return new Vector3(
            m00 * v.x + m10 * v.y + m20 * v.z,
            m01 * v.x + m11 * v.y + m21 * v.z,
            m02 * v.x + m12 * v.y + m22 * v.z,
        );
    }

    /**
     * Point by matrix
     * @param {Vector3} v
     * @returns {Vector3}
     */
    multiplyPoint(v)
    {
        const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33] = this.entries;
        const  num = 1 / (m03 *  v.x +  m13 *  v.y +  m23 *  v.z + m33);

        return new Vector3(
            (m00 *  v.x +  m10 *  v.y +  m20 *  v.z + m30) * num,
            (m01 *  v.x +  m11 *  v.y +  m21 *  v.z + m31) * num,
            (m02 *  v.x +  m12 *  v.y +  m22 *  v.z + m32) * num
        );
    }

    /**
     * translates this instance of Matrix4x4 by a vector
     * @param {Vector3} v - vector to translate by
     */
    translate(v) {
        this.multiply(Matrix4.#translation(v));
        return this;
    }

    /**
     * rotates this instance of Matrix4x4 along the x-axis by an angle
     * @param {number} r - angle to rotate by in degrees
     */
    rotateX(r) {
        this.multiply(Matrix4.#rotationX(r));
        return this;
    }

    /**
     * rotates this instance of Matrix4x4 along the x-axis by an angle
     * @param {number} r - angle to rotate by in degrees
     */
    rotateY(r) {
        this.multiply(Matrix4.#rotationY(r));
        return this;
    }

    /**
     * rotates this instance of Matrix4x4 along the y-axis by an angle
     * @param {number} r - angle to rotate by in degrees
     */
    rotateZ(r) {
        this.multiply(Matrix4.#rotationZ(r));
        return this;
    }

    /**
     * rotates this instance of Matrix4x4 by a vector
     * @param {number} x - x component of the vector
     * @param {number} y - y component of the vector
     * @param {number} z - z component of the vector
     */
    rotate({x, y, z}) {
        this.rotateX(x).rotateY(y).rotateZ(z);
        return this;
    }

    /**
     * scales this instance of Matrix4x4 by a vector
     * @param {Vector3} v - matrix to scale by
     */
    scale(v) {
        this.multiply(Matrix4.#scalation(v));
        return this;
    }

    *[Symbol.iterator] () {
        for (const entry of this.entries) {
            yield entry;
        }
    }
}