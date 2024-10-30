export const defaultAttributeLocations = Object.freeze({
    POSITION: 0,
    NORMAL: 1,
    TEXCOORD_0 : 2
});
export const maxLightCount = 16;

const basicShaderSource = {
//language=GLSL
    vs:
        `#version 300 es
        layout(location = ${defaultAttributeLocations.POSITION})  in vec3 a_position;
        layout(location = ${defaultAttributeLocations.NORMAL})    in vec3 a_normal;
        layout(location = ${defaultAttributeLocations.TEXCOORD_0})in vec2 a_UV;
    
        uniform mat4 u_projection;
        uniform mat4 u_view;
        uniform mat4 u_world;
    
        out vec3 v_normal;
        out vec2 v_UV;
        
        void main(){
            gl_Position = u_projection * u_view * u_world * vec4(a_position, 1.0);
            v_normal = mat3(u_world) * a_normal;
            v_UV = a_UV;
        }
    `,
//language=GLSL
    fs:
        `#version 300 es
        precision highp float;
    
        in vec3 v_normal;
        in vec2 v_UV;
    
        uniform vec4 u_diffuse;
        uniform vec3 u_lightDirection;
        uniform sampler2D u_texture;
    
        out vec4 outColor;
    
        void main() {
            vec3 normal = normalize(v_normal);
            outColor = texture(u_texture, v_UV) * vec4(u_diffuse.rgb * dot(u_lightDirection, normal), u_diffuse.a);    
        }
    `,

    attributes: {
        position: {location: "a_position", size: 3, type: gl.FLOAT},
        UV: {location: "a_UV", size: 2, type: gl.FLOAT},
        normal: {location: "a_normal", size: 3, type: gl.FLOAT},
    },

    uniforms: {
        projection: "u_projection",
        view: "u_view",
        world: "u_world",
        diffuse: "u_diffuse",
        lightDirection: "u_lightDirection"
    }
}

const PBRShaderSource = {

//language=GLSL
    vs:
        `#version 300 es
        layout(location = ${defaultAttributeLocations.POSITION})  in vec3 a_position;
        layout(location = ${defaultAttributeLocations.NORMAL})    in vec3 a_normal;
        layout(location = ${defaultAttributeLocations.TEXCOORD_0})in vec2 a_UV;
    
        uniform mat4 u_projection;
        uniform mat4 u_view;
        uniform mat4 u_world;
        
        out vec3 v_position;
        out vec3 v_normal;
        out vec2 v_UV;
        
        void main(){
            gl_Position = u_projection * u_view * u_world * vec4(a_position, 1.0);
            v_position = vec3(u_world * vec4(a_position, 1.0));
            v_normal = mat3(transpose(inverse(u_world))) * a_normal;
            v_UV = a_UV;
        }
    `,
//language=GLSL
    fs:
        `#version 300 es
        precision highp float;

        in vec3 v_position;
        in vec3 v_normal;
        in vec2 v_UV;

        //uniform sampler2D u_texture;
        uniform int u_dontShade;
        
        uniform vec3 u_baseColor;
        uniform float u_roughness;
        uniform float u_metallic;

        uniform vec3 u_camPos;
        uniform vec3 u_lightPositions[${maxLightCount}];
        uniform vec3 u_lightColors[${maxLightCount}];

        out vec4 outColor;

        float PI = 3.14159265359;

        float flatDot(vec3 a, vec3 b){
            return max(dot(a, b), 0.0);
        }

        vec3 sRGBtoLinear(vec3 rgb){
            return rgb * 0.45454545454;
        }

        //Normal distribution function
        float trowbridgeReitzGGX(vec3 normal, vec3 halfway, float roughness){
            float r4 = pow(roughness, 4.0);
            float nh2 = pow(flatDot(normal, halfway), 2.0);

            return r4 / PI * pow(nh2 * (r4 - 1.0) + 1.0, 2.0);
        }

        //Fresnel equation
        vec3 fresnelSchlick(vec3 incedence, vec3 viewDir, vec3 halfway){
            return incedence + (1.0 - incedence) * pow(1.0 - flatDot(halfway, viewDir), 5.0);
        }

        //Geometry function
        float schlickGGX(float normalDotdirection, float roughness){
            float k = pow(roughness + 1.0, 2.0) / 8.0;
            return normalDotdirection / (normalDotdirection * (1.0 - k) + k);
        }

        void main() {
            if(u_dontShade == 1){
                outColor = vec4(1.0);
                return;
            }
            
            vec3 normal = normalize(v_normal);
            vec3 viewDir = normalize(u_camPos - v_position);
            vec3 F0 = mix(vec3(0.04), u_baseColor, u_metallic);

            vec3 Lo = vec3(0.0);
            for (int i = 0; i < ${maxLightCount}; ++i){
                vec3 lightDir = normalize(u_lightPositions[i] - v_position);
                vec3 halfway = normalize(viewDir + lightDir);
                vec3 radiance = u_lightColors[i] / pow(length(u_lightPositions[i] - v_position), 2.0);

                float nv = flatDot(normal, viewDir);
                float nl = flatDot(normal, lightDir);

                float D = trowbridgeReitzGGX(normal, halfway, u_roughness);
                vec3 F = fresnelSchlick(F0, halfway, viewDir);
                float G = schlickGGX(nv, u_roughness) * schlickGGX(nl, u_roughness);

                vec3 diffuse = vec3(1.0 - F) * (1.0 - u_metallic);
                vec3 specular = D*F*G / max(4.0 * nv * nl, 0.0001);
                Lo += (diffuse * u_baseColor / PI + specular) * radiance * nl;
            }
            vec3 ambient = vec3(0.03) * u_baseColor;
            vec3 color = ambient + Lo;
            color = color / (color + vec3(1.0));
            color = pow(color, vec3(0.45454545454));

            outColor = vec4(color, 1.0);
        }
        `,

    attributes: {
        position: {location: "a_position", size: 3, type: gl.FLOAT},
        UV: {location: "a_UV", size: 2, type: gl.FLOAT},
        normal: {location: "a_normal", size: 3, type: gl.FLOAT},
    },

    uniforms: {
        projection: "u_projection",
        view: "u_view",
        world: "u_world",
        baseColor: "u_baseColor",
        roughness: "u_roughness",
        metallic: "u_metallic",
        cameraPosition: "u_camPos",
        lightPositions: "u_lightPositions",
        lightColors: "u_lightColors",
        dontShade: "u_dontShade",
    },
}

export {basicShaderSource, PBRShaderSource}