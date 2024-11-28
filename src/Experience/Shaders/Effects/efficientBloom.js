// Efficient bloom implementation with dual kawase blur
const EfficientBloomShader = {
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    // Threshold shader - extracts bright areas
    thresholdFragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float threshold;
        varying vec2 vUv;

        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            float brightness = max(max(texel.r, texel.g), texel.b);
            float contribution = max(0.0, brightness - threshold);
            gl_FragColor = texel * contribution;
        }
    `,

    // Optimized dual kawase blur - more efficient than gaussian
    blurFragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float blur;
        varying vec2 vUv;

        vec4 kawaseBlur(sampler2D tex, vec2 uv, vec2 pixelSize, float offset) {
            vec4 o = vec4(0.0);
            vec2 off = pixelSize * offset;
            
            // Optimized 5-tap pattern
            o += texture2D(tex, uv + vec2(-off.x, -off.y)) * 0.25;
            o += texture2D(tex, uv + vec2( off.x, -off.y)) * 0.25;
            o += texture2D(tex, uv + vec2(-off.x,  off.y)) * 0.25;
            o += texture2D(tex, uv + vec2( off.x,  off.y)) * 0.25;
            
            return o;
        }

        void main() {
            vec2 pixelSize = 1.0 / resolution;
            gl_FragColor = kawaseBlur(tDiffuse, vUv, pixelSize, blur);
        }
    `,

    // Final composite shader with tint
    compositeFragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tBloom;
        uniform vec3 tintColor;
        uniform float bloomStrength;
        uniform float tintStrength;
        varying vec2 vUv;

        void main() {
            vec4 bloom = texture2D(tBloom, vUv);
            vec4 original = texture2D(tDiffuse, vUv);
            
            // Apply tint to bloom
            bloom.rgb = mix(bloom.rgb, bloom.rgb * tintColor, tintStrength);
            
            // Composite with original
            gl_FragColor = original + bloom * bloomStrength;
        }
    `
};

export { EfficientBloomShader };
