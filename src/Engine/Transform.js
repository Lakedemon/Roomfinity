import {glMath, Matrix4, Vector3} from "../Math/index.js";

export class Transform {
    constructor(position = Vector3.zero(), rotation = Vector3.zero(), scale = Vector3.one()) {
        this.position = position ?? Vector3.zero();
        this.rotation = rotation ?? Vector3.zero();
        this.scale = scale ?? Vector3.one();
    }

    get copy(){
        return new Transform(this.position, this.rotation, this.scale);
    }

    get worldMatrix(){
        return Matrix4.fromTransform(this);
    }

    get forward(){
        const [x, y] = this.rotation;

        const c = Math.cos(y);
        return new Vector3(-Math.sin(y), c * Math.sin(x), c * Math.cos(x)).normalized;
    }
    get forward2D(){
        const [x, y] = this.rotation;

        const c = Math.cos(y);
        return new Vector3(-Math.sin(y), 0, c * Math.cos(x)).normalized;
    }
    get back2D(){
        return this.forward2D.negative;
    }

    get left(){
        const y = this.rotation.y;
        return new Vector3(Math.cos(y),0,Math.sin(y));
    }
    get up(){
        const [x, y] = this.rotation;

        const s = Math.sin(y);
        return new Vector3(Math.cos(y), /*s * Math.cos(x)*/0, s * Math.cos(x)).normalized;
    }
    get back(){
        return this.forward.negative;
    }
    get right(){
        return this.left.negative;
    }
    get down(){
        return this.up.negative;
    }
}