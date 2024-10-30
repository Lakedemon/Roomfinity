import {Transform} from "./Transform.js";

export class EmptyObject {
    transform;
    parent = null;
    children = [];

    constructor() {
        this.transform = new Transform();
    }

    get worldMatrix(){
        return this.transform.worldMatrix;
    }

    setPosition(v) {
        this.transform.position = v;
    }

    setRotation(v) {
        this.transform.rotation = v;
    }

    setScale(v) {
        this.transform.scale = v;
    }

    setParent(obj) {
        this.parent = EmptyObject;
        obj.addChild(obj);
    }

    removeParent() {
        this.parent.removeChild(this);
        this.parent = null;
    }

    addChild(obj) {
        this.children.push(obj);
    }

    removeChild(obj) {
        const index = this.children.indexOf(obj)
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
}