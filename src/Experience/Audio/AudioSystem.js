import Experience from '../Experience.js'

export default class AudioSystem {
    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug

        // Audio setup
        this.audioContext = null
        this.analyzer = null
        this.frequencyData = null
        this.audioStream = null
        this.audioEnabled = false
        
        // Audio data storage
        this.audioData = {
            bass: 0,
            mid: 0,
            treble: 0,
            average: 0
        }

        this.createAudioButton()
        if (this.debug.active) {
            this.setDebug()
        }
    }

    createAudioButton() {
        const audioButton = document.createElement('button')
        audioButton.textContent = '🎵 Start Audio'
        audioButton.style.position = 'fixed'
        audioButton.style.bottom = '20px'
        audioButton.style.left = '20px'
        audioButton.style.padding = '10px 20px'
        audioButton.style.backgroundColor = '#2196F3'
        audioButton.style.color = 'white'
        audioButton.style.border = 'none'
        audioButton.style.borderRadius = '5px'
        audioButton.style.cursor = 'pointer'
        audioButton.style.fontSize = '16px'
        audioButton.style.zIndex = '1000'
        audioButton.style.transition = 'background-color 0.3s'
        
        audioButton.addEventListener('mouseover', () => {
            audioButton.style.backgroundColor = '#1976D2'
        })
        
        audioButton.addEventListener('mouseout', () => {
            audioButton.style.backgroundColor = '#2196F3'
        })
        
        audioButton.addEventListener('click', () => {
            if (!this.audioEnabled) {
                this.startAudio()
                audioButton.textContent = '🔊 Audio On'
                audioButton.style.backgroundColor = '#4CAF50'
                this.audioEnabled = true
            } else {
                this.stopAudio()
                audioButton.textContent = '🎵 Start Audio'
                audioButton.style.backgroundColor = '#2196F3'
                this.audioEnabled = false
            }
        })
        
        document.body.appendChild(audioButton)
    }

    startAudio() {
        // Create AudioContext only when user initiates
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
            this.analyzer = this.audioContext.createAnalyser()
            this.analyzer.fftSize = 256
            this.frequencyData = new Uint8Array(this.analyzer.frequencyBinCount)
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume()
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                this.audioStream = stream
                const source = this.audioContext.createMediaStreamSource(stream)
                source.connect(this.analyzer)
            })
            .catch(err => {
                console.error('Error accessing microphone:', err)
            })
    }

    stopAudio() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop())
        }
        if (this.audioContext) {
            this.audioContext.suspend()
        }
        
        // Reset audio data
        Object.keys(this.audioData).forEach(key => {
            this.audioData[key] = 0
        })
    }

    update() {
        // Update audio data only if analyzer exists
        if (this.analyzer && this.audioContext && this.audioContext.state === 'running') {
            this.analyzer.getByteFrequencyData(this.frequencyData)
            
            // Calculate frequency bands
            const bass = this.frequencyData.slice(0, 8).reduce((a, b) => a + b) / 8
            const mid = this.frequencyData.slice(8, 24).reduce((a, b) => a + b) / 16
            const treble = this.frequencyData.slice(24, 64).reduce((a, b) => a + b) / 40
            const average = (bass + mid + treble) / 3

            // Normalize values (0-1)
            this.audioData.bass = bass / 255
            this.audioData.mid = mid / 255
            this.audioData.treble = treble / 255
            this.audioData.average = average / 255
        }
        return this.audioData
    }

    setDebug() {
        const debugFolder = this.debug.ui.addFolder('Audio System')
        
        debugFolder.add(this.audioData, 'bass', 0, 1, 0.01).listen()
        debugFolder.add(this.audioData, 'mid', 0, 1, 0.01).listen()
        debugFolder.add(this.audioData, 'treble', 0, 1, 0.01).listen()
        debugFolder.add(this.audioData, 'average', 0, 1, 0.01).listen()
    }

    destroy() {
        this.stopAudio()
        if (this.audioContext) {
            this.audioContext.close()
        }
    }
}
