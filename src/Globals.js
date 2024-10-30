const canvas = document.querySelector("#glCanvas");
window.gl = canvas.getContext("webgl2", {stencil:true});
window.assetsPath = "../../Assets/";

if (gl === null) {
    throw new Error("No webGL for you!");
}