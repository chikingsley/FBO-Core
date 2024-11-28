import * as THREE from 'three'
import Experience from '../Experience.js'

import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";

import simVertex from '../Shaders/Particles/simulation.vert';
import simFragment from '../Shaders/Particles/simulation.frag';

import renderVertex from '../Shaders/Particles/render.vert';
import renderFragment from '../Shaders/Particles/render.frag';

import FBO from "../Utils/FBO.js";
import Stats from 'three/examples/jsm/libs/stats.module.js'

export default class Page {
    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.camera = this.experience.camera.instance
        this.renderer = this.experience.renderer.instance
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.timeline = this.experience.timeline;
        this.isMobile = this.experience.isMobile
        this.cursor = this.experience.cursor

        // Audio setup
        this.audioContext = null;
        this.analyzer = null;
        this.frequencyData = null;
        this.audioEnabled = false;
        
        // Audio debug values
        this.audioData = {
            bass: 0,
            mid: 0,
            treble: 0,
            average: 0
        };

        // Create a simple audio toggle button
        const audioButton = document.createElement('button');
        audioButton.textContent = '🎵 Start Audio';
        audioButton.style.position = 'fixed';
        audioButton.style.bottom = '20px';
        audioButton.style.left = '20px';
        audioButton.style.padding = '10px 20px';
        audioButton.style.backgroundColor = '#2196F3';
        audioButton.style.color = 'white';
        audioButton.style.border = 'none';
        audioButton.style.borderRadius = '5px';
        audioButton.style.cursor = 'pointer';
        audioButton.style.fontSize = '16px';
        audioButton.style.zIndex = '1000';
        audioButton.style.transition = 'background-color 0.3s';
        
        audioButton.addEventListener('mouseover', () => {
            audioButton.style.backgroundColor = '#1976D2';
        });
        
        audioButton.addEventListener('mouseout', () => {
            audioButton.style.backgroundColor = '#2196F3';
        });
        
        audioButton.addEventListener('click', () => {
            if (!this.audioEnabled) {
                this.startAudio();
                audioButton.textContent = '🔊 Audio On';
                audioButton.style.backgroundColor = '#4CAF50';
                this.audioEnabled = true;
            } else {
                this.stopAudio();
                audioButton.textContent = '🎵 Start Audio';
                audioButton.style.backgroundColor = '#2196F3';
                this.audioEnabled = false;
            }
        });
        
        document.body.appendChild(audioButton);

        this.setFBOParticles()

        // Initialize separate Stats instances
        this.statsContainer = document.createElement('div')
        this.statsContainer.style.position = 'absolute'
        this.statsContainer.style.top = '0px'
        this.statsContainer.style.right = '0px'
        document.body.appendChild(this.statsContainer)

        // Create and style labels container
        const createStatsGroup = (label, target, stats) => {
            const group = document.createElement('div')
            group.style.marginBottom = '4px'
            
            const labelElem = document.createElement('div')
            labelElem.style.display = 'flex'
            labelElem.style.justifyContent = 'space-between'
            labelElem.style.color = '#fff'
            labelElem.style.fontSize = '12px'
            labelElem.style.fontFamily = 'monospace'
            labelElem.style.position = 'relative'
            labelElem.style.padding = '2px 4px'
            labelElem.style.backgroundColor = 'rgba(0,0,0,0.5)'
            labelElem.style.borderRadius = '2px'
            labelElem.style.marginBottom = '2px'
            
            const nameSpan = document.createElement('span')
            nameSpan.textContent = label
            
            const targetSpan = document.createElement('span')
            targetSpan.textContent = target
            targetSpan.style.color = '#8f8'
            targetSpan.style.marginLeft = '8px'
            
            labelElem.appendChild(nameSpan)
            labelElem.appendChild(targetSpan)
            
            group.appendChild(labelElem)
            group.appendChild(stats.dom)
            return group
        }

        // FPS panel with label and target
        this.fpsStats = new Stats()
        this.fpsStats.showPanel(0)
        this.fpsStats.dom.style.position = 'relative'
        this.statsContainer.appendChild(createStatsGroup('FPS', '>60', this.fpsStats))

        // MS panel with label and target
        this.msStats = new Stats()
        this.msStats.showPanel(1)
        this.msStats.dom.style.position = 'relative'
        this.statsContainer.appendChild(createStatsGroup('MS', '<16', this.msStats))

        // MB panel with label and target
        this.mbStats = new Stats()
        this.mbStats.showPanel(2)
        this.mbStats.dom.style.position = 'relative'
        this.statsContainer.appendChild(createStatsGroup('MB', '<10', this.mbStats))
    }

    makeTexture(g){

        let vertAmount = g.attributes.position.count;
        let texWidth = Math.ceil(Math.sqrt(vertAmount));
        let texHeight = Math.ceil(vertAmount / texWidth);

        let data = new Float32Array(texWidth * texHeight * 4);

        function shuffleArrayByThree(array) {
            const groupLength = 3;

            let numGroups = Math.floor(array.length / groupLength);

            for (let i = numGroups - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                for (let k = 0; k < groupLength; k++) {
                    let temp = array[i * groupLength + k];
                    array[i * groupLength + k] = array[j * groupLength + k];
                    array[j * groupLength + k] = temp;
                }
            }

            return array;
        }


        shuffleArrayByThree(g.attributes.position.array);

        for(let i = 0; i < vertAmount; i++){
            //let f = Math.floor(Math.random() * (randomTemp.length / 3) );

            const x = g.attributes.position.array[i * 3 + 0];
            const y = g.attributes.position.array[i * 3 + 1];
            const z = g.attributes.position.array[i * 3 + 2];
            const w = 0

            //randomTemp.splice(f * 3, 3);

            data[i * 4 + 0] = x;
            data[i * 4 + 1] = y;
            data[i * 4 + 2] = z;
            data[i * 4 + 3] = w;
        }

        let dataTexture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType);
        dataTexture.needsUpdate = true;

        return dataTexture;
    }

    setFBOParticles() {
        // width and height of FBO
        const width = 512;
        const height = 512;

        function parseMesh(g){
            var vertices = g.vertices;
            var total = vertices.length;
            var size = parseInt( Math.sqrt( total * 4 ) + .5 );
            var data = new Float32Array( size*size * 4 );
            for( var i = 0; i < total; i++ ) {
                data[i * 3] = vertices[i].x;
                data[i * 3 + 1] = vertices[i].y;
                data[i * 3 + 2] = vertices[i].z;
            }
            return data;
        }

        //returns an array of random 3D coordinates
        function getRandomData( width, height, size ){
            var len = width * height * 4;
            var data = new Float32Array( len );
            //while( len-- )data[len] = ( Math.random() -.5 ) * size ;
            for(let i = 0; i < len; i++){
                data[i * 3 + 0] = (Math.random() - 0.5) * size
                data[i * 3 + 1] = (Math.random() - 0.5) * size
                data[i * 3 + 2] = (Math.random() - 0.5) * size
            }

            return data;
        }

        Math.cbrt = Math.cbrt || function (x) {
            var y = Math.pow(Math.abs(x), 1 / 3);
            return x < 0 ? -y : y;
        };

        function getPoint(v, size) {
            //the 'discard' method, not the most efficient
            v.x = Math.random() * 2 - 1;
            v.y = Math.random() * 2 - 1;
            v.z = Math.random() * 2 - 1;
            v.w = 0.0;
            if (v.length() > 1) return getPoint(v, size);
            return v.normalize().multiplyScalar(size);
        }

        //returns a Float32Array buffer of spherical 3D points
        function getSphere(count, size) {

            var len = count * 4;
            var data = new Float32Array(len);
            var p = new THREE.Vector3();
            for (var i = 0; i < len; i += 4) {
                getPoint(p, size);
                data[i] = p.x;
                data[i + 1] = p.y;
                data[i + 2] = p.z;
                data[i + 3] = 0.0;
            }
            return data;
        }

        let data = getSphere( width * height, 128 );
        let texture = new THREE.DataTexture( data, width, height, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping)
        texture.needsUpdate = true;

        this.simulationShader = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { type: "t", value: texture },
                timer: { type: "f", value: 0 },
                frequency: { type: "f", value: 0.01 },
                amplitude: { type: "f", value: 46 },
                maxDistance: { type: "f", value: 48 },
                uBass: { type: "f", value: 0 },
                uMid: { type: "f", value: 0 },
                uTreble: { type: "f", value: 0 }
            },
            vertexShader: simVertex,
            fragmentShader:  simFragment

        });

        this.renderShader = new THREE.ShaderMaterial( {
            uniforms: {
                positions: { type: "t", value: null },
                uPointSize: { type: "f", value: 320 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                big: { type: "v3", value: new THREE.Vector3(207,221,212).multiplyScalar(1/0xFF) },
                small: { type: "v3", value: new THREE.Vector3( 213,239,229).multiplyScalar(1/0xFF) },
                uBass: { type: "f", value: 0 },
                uMid: { type: "f", value: 0 },
                uTreble: { type: "f", value: 0 }
            },
            vertexShader: renderVertex,
            fragmentShader: renderFragment,
            //transparent: true,
            side:THREE.DoubleSide,
            // depthWrite: false,
            // depthTest: false,
            blending:THREE.AdditiveBlending
        } );

        // // Initialize the FBO
        this.FBO = new FBO(width, height, this.renderer, this.simulationShader, this.renderShader);

        this.scene.add(  this.FBO.particles );
    }

    resize() {
        this.FBO.resize(this.sizes.width, this.sizes.height);
        this.renderShader.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }

    setAnimation() {

    }

    setDebug() {
        // Debug
        if(this.debug.active)
        {
            //this.debugFolder = this.debug.gui.addFolder('Cube')
            //this.debugFolder.open()
        }
    }

    update() {
        // Begin performance measurements
        this.fpsStats.begin()
        this.msStats.begin()
        this.mbStats.begin()
        //update simulation
        this.FBO.update();

        // Update audio data only if analyzer exists
        if (this.analyzer && this.audioContext && this.audioContext.state === 'running') {
            this.analyzer.getByteFrequencyData(this.frequencyData);
            
            // Calculate frequency bands
            const bass = this.frequencyData.slice(0, 8).reduce((a, b) => a + b) / 8;
            const mid = this.frequencyData.slice(8, 24).reduce((a, b) => a + b) / 16;
            const treble = this.frequencyData.slice(24, 64).reduce((a, b) => a + b) / 40;
            const average = (bass + mid + treble) / 3;

            // Normalize values (0-1)
            this.audioData.bass = bass / 255;
            this.audioData.mid = mid / 255;
            this.audioData.treble = treble / 255;
            this.audioData.average = average / 255;

            // Update simulation uniforms if they exist
            if (this.simulationShader && this.simulationShader.uniforms) {
                this.simulationShader.uniforms.uBass.value = this.audioData.bass;
                this.simulationShader.uniforms.uMid.value = this.audioData.mid;
                this.simulationShader.uniforms.uTreble.value = this.audioData.treble;
            }
            
            // Update render uniforms
            if (this.renderShader && this.renderShader.uniforms) {
                this.renderShader.uniforms.uBass.value = this.audioData.bass;
                this.renderShader.uniforms.uMid.value = this.audioData.mid;
                this.renderShader.uniforms.uTreble.value = this.audioData.treble;
            }
        }

        // Get audio data if available
        let freqData = { low: 0, mid: 0, high: 0 };
        let mode = null;
        
        if (window.getFrequencyRange) {
            freqData = window.getFrequencyRange();
            mode = window.getCurrentMode();
        }

        // Default values
        let amplitude = 46;
        let frequency = 0.01;
        let pointSize = 320;
        let timer = 0.01;

        // Apply audio effects based on mode
        switch(mode) {
            case 'spread':
                amplitude = 46 + (freqData.low / 255) * 46;
                break;
            case 'speed':
                frequency = 0.01 + (freqData.mid / 255) * 0.02;
                timer = 0.01 + (freqData.mid / 255) * 0.02;
                break;
            case 'size':
                pointSize = 320 + (freqData.high / 255) * 320;
                break;
            case 'color':
                const intensity = freqData.mid / 255;
                const hue = (intensity * 360) % 360; // Map intensity to hue range
                const color = new THREE.Color();
                color.setHSL(hue / 360, 0.7, 0.5); // Set color using HSL
                this.renderShader.uniforms.big.value = color;
                break;
        }

        //update mesh
        this.simulationShader.uniforms.timer.value += timer;
        this.simulationShader.uniforms.frequency.value = frequency;
        this.simulationShader.uniforms.amplitude.value = amplitude;
        this.renderShader.uniforms.uPointSize.value = pointSize;
        
        this.FBO.particles.rotation.x = Math.cos(Date.now() * .001) * Math.PI / 180 * 2;
        this.FBO.particles.rotation.y -= Math.PI / 180 * .05;
        // End performance measurements
        this.fpsStats.end()
        this.msStats.end()
        this.mbStats.end()
    }

    startAudio() {
        // Create AudioContext only when user initiates
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyzer = this.audioContext.createAnalyser();
            this.analyzer.fftSize = 256;
            this.frequencyData = new Uint8Array(this.analyzer.frequencyBinCount);
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                this.audioStream = stream;
                const source = this.audioContext.createMediaStreamSource(stream);
                source.connect(this.analyzer);
            })
            .catch(err => {
                console.error('Error accessing microphone:', err);
            });
    }

    stopAudio() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }
        if (this.audioContext) {
            this.audioContext.suspend();
        }
        
        // Reset audio data
        Object.keys(this.audioData).forEach(key => {
            this.audioData[key] = 0;
        });
    }
}
