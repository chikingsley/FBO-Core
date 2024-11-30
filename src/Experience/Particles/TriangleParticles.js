import * as THREE from 'three'
import Experience from '../Experience.js'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export default class TriangleParticles {
    constructor(count = 1000) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.count = count
        this.particlesGeometry = null
        this.particlesMaterial = null
        this.particles = null

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        if (this.debug) {
            this.setDebug()
        }
    }

    setGeometry() {
        // Base triangle geometry
        const triangleGeometry = new THREE.BufferGeometry()
        
        // Single triangle vertices (equilateral triangle)
        const vertices = new Float32Array([
            -0.5, -0.288675, 0,  // bottom left
             0.5, -0.288675, 0,  // bottom right
             0.0,  0.577350, 0   // top
        ])
        
        // Basic UVs for the triangle
        const uvs = new Float32Array([
            0, 0,
            1, 0,
            0.5, 1
        ])

        triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
        triangleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

        // Instance attributes
        const instancePositions = new Float32Array(this.count * 3)
        const instanceScales = new Float32Array(this.count)
        const instanceRotations = new Float32Array(this.count)
        const instanceColors = new Float32Array(this.count * 3)
        const instanceLife = new Float32Array(this.count)

        // Initialize instance attributes with random values for testing
        for(let i = 0; i < this.count; i++) {
            // Position
            instancePositions[i * 3 + 0] = (Math.random() - 0.5) * 10
            instancePositions[i * 3 + 1] = (Math.random() - 0.5) * 10
            instancePositions[i * 3 + 2] = (Math.random() - 0.5) * 10

            // Scale
            instanceScales[i] = Math.random() * 0.5 + 0.1

            // Rotation
            instanceRotations[i] = Math.random() * Math.PI * 2

            // Color
            instanceColors[i * 3 + 0] = Math.random()
            instanceColors[i * 3 + 1] = Math.random()
            instanceColors[i * 3 + 2] = Math.random()

            // Life
            instanceLife[i] = Math.random()
        }

        triangleGeometry.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(instancePositions, 3))
        triangleGeometry.setAttribute('instanceScale', new THREE.InstancedBufferAttribute(instanceScales, 1))
        triangleGeometry.setAttribute('instanceRotation', new THREE.InstancedBufferAttribute(instanceRotations, 1))
        triangleGeometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(instanceColors, 3))
        triangleGeometry.setAttribute('instanceLife', new THREE.InstancedBufferAttribute(instanceLife, 1))

        this.particlesGeometry = triangleGeometry
    }

    setMaterial() {
        this.particlesMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                attribute vec3 instancePosition;
                attribute float instanceScale;
                attribute float instanceRotation;
                attribute vec3 instanceColor;
                attribute float instanceLife;

                varying vec2 vUv;
                varying vec3 vColor;
                varying float vLife;

                void main() {
                    vUv = uv;
                    vColor = instanceColor;
                    vLife = instanceLife;

                    // Apply rotation
                    float c = cos(instanceRotation);
                    float s = sin(instanceRotation);
                    mat2 rotation = mat2(c, -s, s, c);
                    vec2 rotated = rotation * position.xy;
                    
                    // Apply scale and position
                    vec3 transformed = vec3(rotated.x, rotated.y, position.z);
                    transformed *= instanceScale;
                    transformed += instancePosition;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                varying vec3 vColor;
                varying float vLife;

                void main() {
                    // Simple circle mask
                    float dist = length(vUv - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    
                    // Fade based on life
                    alpha *= vLife;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    }

    setMesh() {
        this.particles = new THREE.InstancedMesh(
            this.particlesGeometry,
            this.particlesMaterial,
            this.count
        )
        this.scene.add(this.particles)
    }

    setDebug() {
        const debugFolder = this.debug.addFolder('Triangle Particles')
        
        debugFolder.add(this, 'count', 100, 10000, 100)
            .onChange(() => {
                this.scene.remove(this.particles)
                this.setGeometry()
                this.setMesh()
            })
    }

    update() {
        // Update instance attributes for animation
        const positions = this.particlesGeometry.attributes.instancePosition
        const rotations = this.particlesGeometry.attributes.instanceRotation
        const life = this.particlesGeometry.attributes.instanceLife

        for(let i = 0; i < this.count; i++) {
            // Simple rotation animation
            rotations.array[i] += 0.01

            // Simple life cycle
            life.array[i] -= 0.005
            if(life.array[i] <= 0) {
                life.array[i] = 1.0
                // Reset position when life cycles
                positions.array[i * 3 + 0] = (Math.random() - 0.5) * 10
                positions.array[i * 3 + 1] = (Math.random() - 0.5) * 10
                positions.array[i * 3 + 2] = (Math.random() - 0.5) * 10
            }
        }

        positions.needsUpdate = true
        rotations.needsUpdate = true
        life.needsUpdate = true
    }
}
