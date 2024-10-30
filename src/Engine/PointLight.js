import {EmptyObject} from "./EmptyObject.js";
import {Vector3} from "../Math/index.js";

export class PointLight extends EmptyObject{
    color;
    intensity;

    constructor(color = Vector3.one(), power = 1) {
        super();
        this.color = color;
        this.intensity = power;
    }

    get scaledColor(){
        return this.color.normalized.scale(this.intensity);
    }
}