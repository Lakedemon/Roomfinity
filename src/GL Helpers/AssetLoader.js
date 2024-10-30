import {Mesh} from "../Engine/Mesh.js";

/**
 * Asynchronously loads and parses data from an .obj file
 * Currently supports position, texture coordinate, normal variables and is able to triangulate quad faces
 * @param {string} path Name of an .obj file stored in the assets folder
 * @param {boolean} useIndex Lets chose to include or not indices into the loaded object
 * @returns {Promise<void>} When finished will update global object "loaded assets" with parsed data
 */
export function loadObject(path, useIndex = false){
    return fetch( `${window.assetsPath}${path}.obj`).then((response) => response.text()).then((data) =>{
        const lines = data.split('\n');

        let unprocessedAsset = {
            POSITION: [],
            TEXCOORD_0: [],
            NORMAL: [],
        }
        let processedAsset = {
            POSITION: [],
            TEXCOORD_0: [],
            NORMAL: [],
            index: [],
        }

        const funcs = ['v', 'vt', 'vn', 'f'];
        lines.filter(line => funcs.some(func => line.startsWith(func))).forEach(function (line){
            const items = line.split(' ');
            switch (items[0]) {
                case 'v':
                    if(useIndex) {
                        processedAsset.POSITION.push(...items.slice(1).map(parseFloat));
                    } else {
                        unprocessedAsset.POSITION.push(items.slice(1));
                    }
                    break;
                case 'vt': unprocessedAsset.TEXCOORD_0.push(items.slice(1)); break;
                case 'vn': unprocessedAsset.NORMAL.push(items.slice(1)); break;
                case 'f':
                    items.slice(1,4).forEach(item => parseAndPush(item));
                    if(items.length === 5){
                        [items[3], items[4], items[1]].forEach(item => parseAndPush(item));
                    }
                    break;
            }
        })

        function parseAndPush(point) {
            const indices = point.split('/');

            if(useIndex) {
                processedAsset.index.push(parseFloat(indices[0] - 1));
            } else {
                processedAsset.POSITION.push(...unprocessedAsset.POSITION[indices[0] - 1].map(parseFloat));
            }

            processedAsset.TEXCOORD_0.push(...unprocessedAsset.TEXCOORD_0[indices[1] - 1].map(parseFloat));
            processedAsset.NORMAL.push(...unprocessedAsset.NORMAL[indices[2] - 1].map(parseFloat));
        }

        return Object.assign(new Mesh(), processedAsset);
    });
}

//Purpose of the type definitions below is to provide context for the IDE and the developing concerning the .glTF file type
/**
 * @typedef GLTF
 * @type {Object}
 * @property {?number} scene
 * @property {?[scene]} scenes
 * @property {?[bufferView]} bufferViews
 * @property {?[accessor]} accessors
 * @property {?[mesh]} meshes
 * @property {?[material]} materials
 * @property {?[Object]} nodes
 * @property {?[buffer]} buffers
 */

/**
 * @typedef scene
 * @type {Object}
 * @property {?string} name
 * @property {?[number]} nodes
 */

/**
 * @typedef materials
 * @type {Object}
 * @property {string} name
 * @property {?[pbrMetallicRoughness]} pbrMetallicRoughness
 *
 */

/**
 * @typedef pbrMetallicRoughness
 * @type {Object}
 * @property {string} baseColorFactor
 * @property {string} metallicFactor
 * @property {string} roughnessFactor
 *
 */

/**
 * @typedef mesh
 * @type {Object}
 * @property {string} name
 * @property {[primitive]} primitives
 *
 */

/**
 * @typedef primitive
 * @type {Object}
 * @property {Object} attributes
 * @property {number} indices
 * @property {number} material
 */

/**
 * @typedef accessor
 * @type {Object}
 * @property {number} bufferView
 * @property {number} componentType
 * @property {number} count
 * @property {number} type
 */

/**
 * @typedef bufferView
 * @type {Object}
 * @property {?number} buffer
 * @property {?number} byteLength
 * @property {?number} byteOffset
 */

/**
 * @typedef buffer
 * @type {Object}
 * @property {?number} byteLength
 * @property {?string} uri
 */

export async function loadGLTF(path){
    const data = await fetch(`../../Assets/gltf/${path}.gltf`)
        .then(response => response.json());

    data.realisedBuffers = [];
    for(const buffer of data.buffers){
        data.realisedBuffers.push(await fetch(`../../Assets/gltf/${buffer.uri}`)
            .then(response => {return response.arrayBuffer()}));
    }
    return data;
}
