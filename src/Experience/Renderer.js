import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EfficientBloomPass } from './Effects/EfficientBloomPass.js'
import gsap from "gsap";

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug.panel
        this.resources = this.experience.resources
        this.timeline = this.experience.timeline
        this.html = this.experience.html

        this.usePostprocess = true

        this.setInstance()
        this.setPostProcess()
        this.setDebug()
    }

    setInstance()
    {
        this.clearColor = '#010101'

        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            powerPreference: "high-performance",
            antialias: false,
            alpha: false,
            // stencil: false,
            // depth: false,
            useLegacyLights: false,
            physicallyCorrectLights: true,
            logarithmicDepthBuffer: true,
        })

        this.instance.outputColorSpace = THREE.SRGBColorSpace
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    resize()
    {
        // Instance
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.postProcess.composer.setSize(this.sizes.width, this.sizes.height)
        this.postProcess.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    setPostProcess() {
        this.postProcess = {}

        // Render pass
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        // Efficient bloom pass
        this.postProcess.bloomPass = new EfficientBloomPass(
            new THREE.Vector2(this.sizes.width / 2, this.sizes.height / 2)
        )
        
        // Initialize composer
        this.postProcess.composer = new EffectComposer(this.instance)
        this.postProcess.composer.addPass(this.postProcess.renderPass)
        this.postProcess.composer.addPass(this.postProcess.bloomPass)

        // Set up debug if available
        if (this.debug) {
            const bloomFolder = this.debug.addFolder({
                title: 'Bloom Effect'
            })

            // Threshold - controls what brightness level starts to glow
            bloomFolder.addInput(
                this.postProcess.bloomPass,
                'threshold',
                { 
                    min: 0, 
                    max: 1, 
                    step: 0.01,
                    label: 'Threshold',
                    tooltip: 'Brightness threshold for bloom (0=everything glows, 1=only very bright)'
                }
            )

            // Overall bloom intensity
            bloomFolder.addInput(
                this.postProcess.bloomPass,
                'bloomStrength',
                { 
                    min: 0, 
                    max: 3, 
                    step: 0.01,
                    label: 'Intensity',
                    tooltip: 'Overall bloom strength'
                }
            )

            // Tint color
            bloomFolder.addInput(
                this.postProcess.bloomPass,
                'tintColor',
                { 
                    view: 'color',
                    label: 'Glow Color',
                    tooltip: 'Color tint for the bloom effect'
                }
            )

            // Tint strength
            bloomFolder.addInput(
                this.postProcess.bloomPass,
                'tintStrength',
                { 
                    min: 0, 
                    max: 1, 
                    step: 0.01,
                    label: 'Color Mix',
                    tooltip: 'How much the tint color affects the glow'
                }
            )

            // Number of blur passes
            bloomFolder.addInput(
                this.postProcess.bloomPass,
                'nMips',
                { 
                    min: 1, 
                    max: 5, 
                    step: 1,
                    label: 'Quality',
                    tooltip: 'Number of blur passes (higher = smoother but slower)'
                }
            )

            // Resolution scale
            bloomFolder.addInput(
                this.postProcess.bloomPass.resolution,
                'x',
                { 
                    min: this.sizes.width / 4, 
                    max: this.sizes.width, 
                    step: this.sizes.width / 8,
                    label: 'Resolution',
                    tooltip: 'Bloom resolution (lower = faster but less detailed)'
                }
            ).on('change', () => {
                this.postProcess.bloomPass.resolution.y = this.postProcess.bloomPass.resolution.x * (this.sizes.height / this.sizes.width);
                this.postProcess.bloomPass.setSize(this.sizes.width, this.sizes.height);
            })
        }
    }

    setDebug()
    {
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'renderer'
            })
        }
    }

    update()
    {
        if ( this.usePostprocess ){
            this.postProcess.composer.render()
        }else{
            this.instance.render(this.scene, this.camera.instance)
        }
    }

    destroy()
    {

    }
}
