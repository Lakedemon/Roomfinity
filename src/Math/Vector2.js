import {glMath} from "./glMath.js";

/** Class that represents a 2D vector*/
export class Vector2 {
    /**
     * Create a Vector2
     * @param {number} x - Value of x
     * @param {number} y - Value of y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns magnitude of this instance of Vector2
     * @returns {number} magnitude
     */
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns a unit vector of this instance of Vector2
     * @returns {Vector2} unit vector
     */
    get normalized() {
        const length = this.magnitude;
        if (length < glMath.EPSILON) {
            return Vector2.zero;
        }

        const lengthInv = 1 / length;
        return new Vector2(this.x * lengthInv, this.y * lengthInv);
    }

    static one() {
        return new Vector2(1, 1);
    }

    static zero() {
        return new Vector2(0, 0);
    }

    static up() {
        return new Vector2(0, 1);
    }

    static down() {
        return new Vector2(0, -1);
    }

    static left() {
        return new Vector2(-1, 0);
    }

    static right() {
        return new Vector2(1, 0);
    }

    /**
     * Calculates angle between vectors
     * @param {Vector2} a - Vector a
     * @param {Vector2} b - Vector b
     * @returns {number} angle between vectors a and b in degrees
     */
    static angle(a, b) {
        const mag = (a.magnitude * b.magnitude);
        if (mag < glMath.EPSILON) return 0;

        return Math.acos(Vector2.dot(a, b) / (a.magnitude * b.magnitude));
    }

    /**
     * Calculates dot product of two vectors
     * @param {Vector2} a - Vector a
     * @param {Vector2} b - Vector b
     * @returns {number} dot product of a and d
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Calculates cross product of two vectors
     * @param {Vector2} a - Vector a
     * @param {Vector2} b - Vector b
     * @returns {number} cross product of a and d
     */
    static cross(a, b) {
        return new Vector2(a.x * b.y - a.y * b.x);
    }

    /**
     * Calculates sum of two vectors
     * @param {Vector2} a - Vector a
     * @param {Vector2} b - Vector b
     * @returns {number} sum of a and d
     */
    static sum(a, b) {
        return new Vector2(a.x + b.y, a.y + b.y);
    }

    /**
     * Calculates sum of two vectors
     * @param {Vector2} a - Vector a
     * @param {Vector2} b - Vector b
     * @returns {number} difference between a and d
     */
    static difference(a, b) {
        return new Vector2(a.x - b.y, a.y - b.y);
    }

    /**
     * Calculates product of two vectors
     * @param {Vector2} a - Vector a
     * @param {Vector2} b - Vector b
     * @returns {number} product of a and d
     */
    static product(a, b) {
        return new Vector2(a.x * b.y, a.y * b.y);
    }

    /**
     * Calculates product of a vector and a scalar
     * @param {Vector2} v - Vector
     * @param {number} s - Scalar
     * @returns {number} product of v and s
     */
    static productS(v, s) {
        return new Vector2(v.x * s, v.y * s);
    }

    /**
     * Adds a vector to this instance of Vector2
     * @param {Vector2} v - vector to add
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    /**
     * Subtracts a vector from this instance of Vector2
     * @param {Vector2} v - vector to subtract
     */
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    /**
     * Multiplies this instance of Vector2 by a vector
     * @param {Vector2} v - vector to multiply by
     */
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
    }

    /**
     * Multiplies this instance of Vector2 by a scalar
     * @param {number} s - scalar to multiply by
     */
    scale(s) {
        this.x *= s;
        this.y *= s;
    }

    *[Symbol.iterator] () {
        yield this.x;
        yield this.y;
    }
}