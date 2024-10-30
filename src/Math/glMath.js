export const glMath = {
    PID: Math.PI / 180,
    DPI: 180 / Math.PI,
    PI2: Math.PI * 2,
    PI05: Math.PI * 0.5,
    EPSILON: 0.000001,
    LUMENS_PER_WATT: 683,

    toDeg: function (r) {
        return r * this.DPI;
    },

    toRad: function (d) {
        return d * this.PID;
    },

    logMatrix: function (m) {
        console.table([
            [m.entries[0], m.entries[1], m.entries[2], m.entries[3]],
            [m.entries[4], m.entries[5], m.entries[6], m.entries[7]],
            [m.entries[8], m.entries[9], m.entries[10], m.entries[11]],
            [m.entries[12], m.entries[13], m.entries[14], m.entries[15]]])
    },

    clampUnit : function (n) {
        return Math.max( -1, Math.min(n, 1));
    },

    toHFOV: function (fov, aspect){
        return 2 * Math.atan(Math.tan(fov/2) / aspect);
    },

    toYFOV: function (fov, aspect){
        return 2 * Math.atan(Math.tan(fov/2) * aspect);
    },

    toPower: function (intensity){
        return 4 * Math.PI * intensity / this.LUMENS_PER_WATT;
    },

    typedArrayToWebGLType: {
        5120: Int8Array,
        5121: Uint8Array,
        5122: Int16Array,
        5123: Uint16Array,
        5125: Uint32Array,
        5126: Float32Array,
    }
}