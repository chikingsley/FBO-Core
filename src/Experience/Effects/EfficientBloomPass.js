import * as THREE from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { EfficientBloomShader } from '../Shaders/Effects/efficientBloom.js';

class EfficientBloomPass extends Pass {
    constructor(resolution = new THREE.Vector2(256, 256)) {
        super();

        this.resolution = resolution;
        this.threshold = 0.7;
        this.bloomStrength = 1.8;
        this.tintColor = new THREE.Color('#790000');
        this.tintStrength = 0.15;

        // Create render targets
        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 3; // Reduced from 5 to 3 for better performance

        this.renderTargetBright = new THREE.WebGLRenderTarget(resolution.x, resolution.y);

        for (let i = 0; i < this.nMips; i++) {
            const renderTargetHorizonal = new THREE.WebGLRenderTarget(resolution.x >> i, resolution.y >> i);
            const renderTargetVertical = new THREE.WebGLRenderTarget(resolution.x >> i, resolution.y >> i);
            
            this.renderTargetsHorizontal.push(renderTargetHorizonal);
            this.renderTargetsVertical.push(renderTargetVertical);
        }

        // Threshold material
        this.thresholdMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                threshold: { value: this.threshold }
            },
            vertexShader: EfficientBloomShader.vertexShader,
            fragmentShader: EfficientBloomShader.thresholdFragmentShader
        });

        // Blur material
        this.blurMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                resolution: { value: this.resolution },
                blur: { value: 1.0 }
            },
            vertexShader: EfficientBloomShader.vertexShader,
            fragmentShader: EfficientBloomShader.blurFragmentShader
        });

        // Composite material
        this.compositeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                tBloom: { value: null },
                tintColor: { value: this.tintColor },
                bloomStrength: { value: this.bloomStrength },
                tintStrength: { value: this.tintStrength }
            },
            vertexShader: EfficientBloomShader.vertexShader,
            fragmentShader: EfficientBloomShader.compositeFragmentShader
        });

        this.fsQuad = new FullScreenQuad();
    }

    dispose() {
        this.renderTargetBright.dispose();
        
        for (let i = 0; i < this.nMips; i++) {
            this.renderTargetsHorizontal[i].dispose();
            this.renderTargetsVertical[i].dispose();
        }

        this.thresholdMaterial.dispose();
        this.blurMaterial.dispose();
        this.compositeMaterial.dispose();
        this.fsQuad.dispose();
    }

    setSize(width, height) {
        const reductionFactor = 2;
        this.resolution.set(width / reductionFactor, height / reductionFactor);
        
        this.renderTargetBright.setSize(this.resolution.x, this.resolution.y);
        
        for (let i = 0; i < this.nMips; i++) {
            this.renderTargetsHorizontal[i].setSize(this.resolution.x >> i, this.resolution.y >> i);
            this.renderTargetsVertical[i].setSize(this.resolution.x >> i, this.resolution.y >> i);
        }
    }

    render(renderer, writeBuffer, readBuffer) {
        // 1. Extract bright areas
        this.fsQuad.material = this.thresholdMaterial;
        this.thresholdMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        renderer.setRenderTarget(this.renderTargetBright);
        this.fsQuad.render(renderer);

        // 2. Blur with optimized dual kawase
        let inputRenderTarget = this.renderTargetBright;
        
        for (let i = 0; i < this.nMips; i++) {
            this.fsQuad.material = this.blurMaterial;
            this.blurMaterial.uniforms.tDiffuse.value = inputRenderTarget.texture;
            this.blurMaterial.uniforms.blur.value = (i + 1) * 2;

            // Horizontal pass
            renderer.setRenderTarget(this.renderTargetsHorizontal[i]);
            this.fsQuad.render(renderer);

            // Vertical pass
            this.blurMaterial.uniforms.tDiffuse.value = this.renderTargetsHorizontal[i].texture;
            renderer.setRenderTarget(this.renderTargetsVertical[i]);
            this.fsQuad.render(renderer);

            inputRenderTarget = this.renderTargetsVertical[i];
        }

        // 3. Composite
        this.fsQuad.material = this.compositeMaterial;
        this.compositeMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        this.compositeMaterial.uniforms.tBloom.value = this.renderTargetsVertical[this.nMips - 1].texture;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
        } else {
            renderer.setRenderTarget(writeBuffer);
        }

        this.fsQuad.render(renderer);
    }
}

export { EfficientBloomPass };
