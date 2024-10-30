import {glMath} from "./glMath.js";

/** Class that represents a 4D vector*/
export class Vector4 {
    /**
     * Create a Vector4
     * @param {number} x - Value of x
     * @param {number} y - Value of y
     * @param {number} z - Value of z
     * @param {number} w - Value of w
     */
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static fromVector3(v){
        return new Vector4(...v, 1);
    }

    /**
     * Returns magnitude of this instance of Vector4
     * @returns {number} magnitude
     */
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    /**
     * Returns a unit vector of this instance of Vector4
     * @returns {Vector4} unit vector
     */
    get normalized() {
        const length = this.magnitude;
        if (length < glMath.EPSILON) return Vector4.zero;

        const lengthInv = 1 / length;
        return new Vector4(this.x * lengthInv, this.y * lengthInv, this.z * lengthInv, this.w * lengthInv);
    }

    get negative(){
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    }

    static one() {
        return new Vector4(1, 1, 1, 1);
    }

    static zero() {
        return new Vector4(0, 0, 0, 0);
    }
    /**
     * Calculates angle between vectors
     * @param {Vector4} a - Vector a
     * @param {Vector4} b - Vector b
     * @returns {number} angle between vectors a and b in degrees
     */
    static angle(a, b) {
        const mag = (a.magnitude * b.magnitude);
        if (mag < glMath.EPSILON) return 0;

        return Math.acos(Vector4.dot(a, b) / (a.magnitude * b.magnitude));
    }

    /**
     * Calculates dot product of two vectors
     * @param {Vector4} a - Vector a
     * @param {Vector4} b - Vector b
     * @returns {number} dot product of a and d
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * a.w;
    }

    /**
     * Calculates sum of two vectors
     * @param {Vector4} a - Vector a
     * @param {Vector4} b - Vector b
     * @returns {Vector4} sum of a and d
     */
    static sum(a, b) {
        return new Vector4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
    }

    /**
     * Calculates sum of two vectors
     * @param {Vector4} a - Vector a
     * @param {Vector4} b - Vector b
     * @returns {Vector4} difference between a and d
     */
    static difference(a, b) {
        return new Vector4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
    }

    /**
     * Calculates product of two vectors
     * @param {Vector4} a - Vector a
     * @param {Vector4} b - Vector b
     * @returns {Vector4} product of a and d
     */
    static product(a, b) {
        return new Vector4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
    }

    /**
     * Calculates product of a vector and a scalar
     * @param {Vector4} v - Vector
     * @param {number} s - Scalar
     * @returns {Vector4} product of v and s
     */
    static productS(v, s) {
        return new Vector4(v.x * s, v.y * s, v.z * s, v.w * s);
    }

    /**
     * Adds a vector to this instance of Vector4
     * @param {Vector4} v - vector to add
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
    }

    /**
     * Subtracts a vector from this instance of Vector4
     * @param {Vector4} v - vector to subtract
     */
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
    }

    /**
     * Multiplies this instance of Vector4 by a vector
     * @param {Vector4} v - vector to multiply by
     */
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
    }

    /**
     * Multiplies this instance of Vector4 by a scalar
     * @param {number} s - scalar to multiply by
     */
    scale(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    }

    *[Symbol.iterator] () {
        yield this.x;
        yield this.y;
        yield this.z;
        yield this.w;
    }
}