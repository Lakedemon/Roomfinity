import {glMath} from "./glMath.js";

/** Class that represents a 3D vector*/
export class Vector3 {
    /**
     * Create a Vector3
     * @param {number} x - Value of x
     * @param {number} y - Value of y
     * @param {number} z - Value of z
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns magnitude of this instance of Vector3
     * @returns {number} magnitude
     */
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Returns a unit vector of this instance of Vector3
     * @returns {Vector3} unit vector
     */
    get normalized() {
        const length = this.magnitude;
        if (length < glMath.EPSILON) return Vector3.zero;

        const lengthInv = 1 / length;
        return new Vector3(this.x * lengthInv, this.y * lengthInv, this.z * lengthInv);
    }

    get negative(){
        return new Vector3(-this.x, -this.y, -this.z);
    }

    static one() {
        return new Vector3(1, 1, 1);
    }

    static zero() {
        return new Vector3(0, 0, 0);
    }

    static up() {
        return new Vector3(0, 1, 0);
    }

    static down() {
        return new Vector3(0, -1, 0);
    }

    static left() {
        return new Vector3(-1, 0, 0);
    }

    static right() {
        return new Vector3(1, 0, 0);
    }

    static forward() {
        return new Vector3(0, 0, 1);
    }

    static back() {
        return new Vector3(0, 0, -1);
    }

    static side(depended, control, normal)
    {
        return Math.sign(Vector3.dot(Vector3.difference(depended, control), normal));
    }

    static distance(a, b){
        return Vector3.difference(a, b).magnitude;
    }
    /**
     * Calculates angle between vectors
     * @param {Vector3} a - Vector a
     * @param {Vector3} b - Vector b
     * @returns {number} angle between vectors a and b in degrees
     */
    static angle(a, b) {
        const mag = (a.magnitude * b.magnitude);
        if (mag < glMath.EPSILON) return 0;

        return Math.acos(Vector3.dot(a, b) / (a.magnitude * b.magnitude));
    }

    /**
     * Calculates dot product of two vectors
     * @param {Vector3} a - Vector a
     * @param {Vector3} b - Vector b
     * @returns {number} dot product of a and d
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * Calculates cross product of two vectors
     * @param {Vector3} a - Vector a
     * @param {Vector3} b - Vector b
     * @returns {Vector3} cross product of a and d
     */
    static cross(a, b) {
        return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }

    /**
     * Calculates sum of two vectors
     * @param {Vector3} a - Vector a
     * @param {Vector3} b - Vector b
     * @returns {Vector3} sum of a and d
     */
    static sum(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    /**
     * Calculates sum of two vectors
     * @param {Vector3} a - Vector a
     * @param {Vector3} b - Vector b
     * @returns {Vector3} difference between a and d
     */
    static difference(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    /**
     * Calculates product of two vectors
     * @param {Vector3} a - Vector a
     * @param {Vector3} b - Vector b
     * @returns {Vector3} product of a and d
     */
    static product(a, b) {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    /**
     * Calculates product of a vector and a scalar
     * @param {Vector3} v - Vector
     * @param {number} s - Scalar
     * @returns {Vector3} product of v and s
     */
    static productS(v, s) {
        return new Vector3(v.x * s, v.y * s, v.z * s);
    }

    static QuaternionToEuler(qx, qy, qz, qw){
        const x = -Math.atan2(
            2.0 * (qw * qx + qy * qz),
            1.0 - 2.0 * (qx * qx + qy * qy)
        );

        const y = Math.asin(
            glMath.clampUnit(2.0 * (qw * qy - qz * qx))
        );

        const z = Math.atan2(
            2.0 * (qw * qz + qx * qy),
            1.0 - 2.0 * (qy * qy + qz * qz)
        );

        return new Vector3(x, y, z);
    }

    /**
     * Adds a vector to this instance of Vector3
     * @param {Vector3} v - vector to add
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    /**
     * Subtracts a vector from this instance of Vector3
     * @param {Vector3} v - vector to subtract
     */
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    /**
     * Multiplies this instance of Vector3 by a vector
     * @param {Vector3} v - vector to multiply by
     */
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    /**
     * Multiplies this instance of Vector3 by a scalar
     * @param {number} s - scalar to multiply by
     */
    scale(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    *[Symbol.iterator] () {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}