import {Object3D} from "./Object3D.js";
import {Mesh} from "./Mesh.js";
import {glMath, Matrix4, Vector3, Vector4} from "../Math/index.js";
import {pbrMetallicRoughness} from "./Material.js";
import {Camera} from "./Camera.js";
import {PointLight} from "./PointLight.js";
import {maxLightCount} from "../GL Helpers/ShaderSource.js";

export class SceneGraph{
    mainCamera;
    shader;

    portalLinks = [];
    objects = {};
    lights = {};

    meshes = {};
    materials = {};

    constructor(shader) {
        this.shader = shader;
        gl.useProgram(this.shader.program);
    }

    setMainCamera(camera){
        this.mainCamera = camera;
        this.mainCamera.updateUniforms(this.shader);
    }

    setLights() {
        let pos = [], color = [];
        Object.values(this.lights).forEach(light => {pos.push(...light.transform.position); color.push(...light.scaledColor)});
        for(let i = 0; i < maxLightCount - Object.keys(this.lights).length; i++){
            pos.push(0, 0, 0);
            color.push(0, 0, 0);
        }

        gl.uniform3fv(this.shader.uniforms.lightPositions, new Float32Array(pos));
        gl.uniform3fv(this.shader.uniforms.lightColors, new Float32Array(color));
    }

    updateScene(clearColor = [0.2, 0.5, 0.3, 1]) {
        gl.clearColor(...clearColor);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        this.mainCamera.updateUniforms(this.shader);
    }

    portalDraw() {
        //for all portals evaluating on which side of the portal an observer is
        const newSides = this.portalLinks.map(link => Vector3.side(link.master.transform.position, this.mainCamera.transform.position, link.master.transform.back));

        //handling teleportation
        for(let i = 0; i < this.portalLinks.length; i++){
            const {master, link, side} = this.portalLinks[i];
            const newSide = newSides[i];

            let collide = Vector3.distance(master.transform.position, this.mainCamera.transform.position) < master.mesh.boundingRadius(new Vector3(1, 0, 1));

            if(typeof side === "undefined"){
                this.portalLinks[i].side = newSide;
            } else if(newSide !== side && collide){
                this.mainCamera.relativeMirror(master.worldMatrix, link.worldMatrix).inverse.toTransform(this.mainCamera.transform);
                this.portalLinks = this.portalLinks.map(link => {link.side = Vector3.side(link.master.transform.position, this.mainCamera.transform.position, link.master.transform.back); return link});
            }

            this.portalLinks[i].side = newSide;
        }

        //drawing the insides of the portal(the stencil part)
        for (const {master, link, side} of this.portalLinks) {
            //drawing frame into stencil
            gl.colorMask(false, false, false, false);
            gl.depthMask(false);
            gl.disable(gl.DEPTH_TEST);

            gl.enable(gl.STENCIL_TEST);
            gl.stencilOp(gl.INCR, gl.KEEP, gl.KEEP);
            gl.stencilFunc(gl.NEVER, 1, 0xff);
            gl.stencilMask(0xff);

            master.drawObject();

            //drawing scene inside of the portal
            gl.colorMask(true,true,true, true);
            gl.depthMask(true);

            gl.enable(gl.DEPTH_TEST);

            gl.stencilMask(0x00);
            gl.stencilFunc(gl.EQUAL, 1, 0xff);

            let rm = this.mainCamera.relativeMirror(master.worldMatrix, link.worldMatrix);
            let proj = this.mainCamera.projectionMatrix.copy;
            proj.clipProjectionMatrix(Camera.clippingPlane(master.transform, this.mainCamera.viewMat, side));

            gl.uniformMatrix4fv(this.shader.uniforms.projection, false, proj.glify);
            gl.uniformMatrix4fv(this.shader.uniforms.view, false, rm.glify);
            gl.uniform3f(this.shader.uniforms.cameraPosition, ...rm.inverse.position);
            this.defaultDraw([Object3D.objectTags.Portal]);

            //resetting stencil test to separate stencils of every portal
            this.mainCamera.updateUniforms(this.shader);

            gl.colorMask(false, false, false, false);
            gl.depthMask(false);
            gl.enable(gl.STENCIL_TEST);
            gl.stencilMask(0xff);

            gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
            gl.stencilOp(gl.DECR, gl.KEEP, gl.KEEP);
            master.drawObject();
        }

        //drawing portals to depth buffer from original point of view
        gl.disable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.depthMask(true);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        this.portalLinks.forEach(link => link.master.drawObject());

        //drawing the rest of the scene with default view and setting
        gl.colorMask(true, true, true,true);
        this.defaultDraw([Object3D.objectTags.Portal]);
    }

    defaultDraw(exceptionTags = []){
        Object.values(this.objects).filter(obj => !exceptionTags.includes(obj.tag)).forEach(obj => obj.drawObject());
    }

    static fromGLTF(gltf, shader){
        const scene = new SceneGraph(shader);

        gltf.materials.forEach(material => {
            scene.materials[material.name] = Object.assign(new pbrMetallicRoughness(), material.pbrMetallicRoughness);
        })

        gltf.meshes.forEach(mesh => {
            const primitive = mesh.primitives[0];
            const {POSITION, NORMAL, TEXCOORD_0} = primitive.attributes;

            scene.meshes[mesh.name] = new Mesh(
                daraFromAccessor(POSITION),
                daraFromAccessor(NORMAL),
                daraFromAccessor(TEXCOORD_0),
                daraFromAccessor(primitive.indices)
            );
        });


        gltf.nodes.forEach(node => {
            let parsedNode;

            if(node.hasOwnProperty("mesh")) {
                let tag = Object3D.objectTags.Default;
                if (node.hasOwnProperty("extras") && node.extras.hasOwnProperty("linked_portal")) {
                    scene.portalLinks.push({master: node.name, link: node.extras.linked_portal.name, side: undefined});
                    tag = Object3D.objectTags.Portal;
                }

                parsedNode = new Object3D(Object.values(scene.meshes)[node.mesh], shader, Object.values(scene.materials)[gltf.meshes[node.mesh].primitives[0].material], tag);
                scene.objects[node.name] = parsedNode;
            } else if(node.hasOwnProperty("camera") && typeof scene.mainCamera === "undefined"){
                let camData = gltf.cameras[node.camera].perspective;

                let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
                let fov = glMath.toDeg(glMath.toYFOV(camData.yfov, camData.aspectRatio));

                parsedNode = new Camera(fov, aspect, camData.znear, camData.zfar);
                scene.setMainCamera(parsedNode);
            } else if(node.hasOwnProperty("extensions") && node.extensions.hasOwnProperty("KHR_lights_punctual") && Object.keys(scene.lights).length < maxLightCount){
                let lightData = gltf.extensions.KHR_lights_punctual.lights[node.extensions.KHR_lights_punctual.light];
                parsedNode = new PointLight(new Vector3(...lightData.color), glMath.toPower(lightData.intensity));
                scene.lights[node.name] = parsedNode;
            }

            if(!parsedNode) {return;}
            setNodeTransforms(node, parsedNode);
        });

        function setNodeTransforms(node, obj){
            if (node.hasOwnProperty("translation")) {
                obj.setPosition(new Vector3(...node.translation));
            }
            if (node.hasOwnProperty("rotation")) {
                obj.setRotation(Vector3.QuaternionToEuler(...node.rotation));
            }
            if (node.hasOwnProperty("scale")) {
                obj.setScale(new Vector3(...node.scale))
            }
        }

        function daraFromAccessor(accessorIndex){
            const accessor = gltf.accessors[accessorIndex];
            const {buffer, byteLength, byteOffset} = gltf.bufferViews[accessor.bufferView];

            const typedArray = glMath.typedArrayToWebGLType[accessor.componentType];
            const bpe = 1 / typedArray.BYTES_PER_ELEMENT;

            return new typedArray(gltf.realisedBuffers[buffer], byteOffset, byteLength * bpe);
        }

        scene.portalLinks = scene.portalLinks.map(link => {
            link.master = scene.objects[link.master];
            link.link = scene.objects[link.link];
            return link;
        });

        scene.setLights();

        return scene;
    }
}