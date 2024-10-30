import {glMath, Matrix4, Vector2, Vector3} from "../Math/index.js";

export class FirstPersonController{
    // Flipped when controlling camera, because camera matrix is then inverted to make a view matrix
    static wasdControls = Object.freeze({
        w : (v) => v.back2D,
        a : (v) => v.right,
        s : (v) => v.forward2D,
        d : (v) => v.left,
    })

    static defaultTurnLimits = Object.freeze({
        x: [glMath.toRad(-30), glMath.toRad(30)],
        y: false,
    })

    #controlledTransform;
    #controlScheme;
    #triggers;
    #limits;

    constructor(transform, controlScheme, limits, moveSpeed = 0.015, turnSpeed = 0.005) {
        this.#controlledTransform = transform;
        this.#controlScheme = controlScheme ?? FirstPersonController.wasdControls;
        this.#limits = limits ?? FirstPersonController.defaultTurnLimits;
        this.#triggers = Object.fromEntries(Object.keys(this.#controlScheme).map((key) => [key, false]));
        this.moveSpeed = moveSpeed;
        this.turnSpeed = turnSpeed;

        window.addEventListener('mousemove', (event) => this.#mouseListener(event));
        window.addEventListener('keydown', (event) => this.#triggerMove(event.key.toLowerCase()))
        window.addEventListener('keyup', (event) => this.#stopMove(event.key.toLowerCase()))
    }

    #triggerMove(key){
        if(key in this.#triggers){
            this.#triggers[key] = true;
        }
    }

    #stopMove(key){
        if(key in this.#triggers){
            this.#triggers[key] = false;
        }
    }

    move(){
        Object.entries(this.#triggers).filter((e) => e[1] === true).forEach((e) => {
            this.#controlledTransform.position.add(Vector3.productS(this.#controlScheme[e[0]](this.#controlledTransform), this.moveSpeed));
        })
    }


    #mouseListener(event){
        let turnX = event.movementY * this.turnSpeed;
        let turnY = event.movementX * this.turnSpeed;

        if(this.#limits.x){
            if(this.#controlledTransform.rotation.x + turnX < this.#limits.x[0] || this.#controlledTransform.rotation.x + turnX > this.#limits.x[1]){
                turnX = 0;
            }
        }

        if(this.#limits.y){
            if(this.#controlledTransform.rotation.y + turnY < this.#limits.y[0] || this.#controlledTransform.rotation.y + turnY > this.#limits.y[1]){
                turnY = 0;
            }
        }
        this.#controlledTransform.rotation.add(new Vector3(turnX,turnY, 0));
    }
}