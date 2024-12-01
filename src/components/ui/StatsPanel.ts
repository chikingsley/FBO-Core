import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Metrics {
    fps: number;
    ms: number;
    mb: number;
}

@customElement('ui-stats-panel')
export class StatsPanel extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            top: 0;
            right: 0;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 1000;
        }

        .stats-panel {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .metric {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            padding: 4px;
            width: 80px;
        }

        .metric__header {
            display: flex;
            justify-content: space-between;
            color: #fff;
            font-size: 12px;
            font-family: monospace;
            padding: 2px 4px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 2px;
            margin-bottom: 2px;
            backdrop-filter: blur(4px);
        }

        .metric__label {
            color: #fff;
        }

        .metric__value {
            color: #8f8;
        }

        .metric__canvas {
            width: 80px;
            height: 30px;
        }

        .metric--fps canvas { background-color: #001f00; }
        .metric--ms canvas { background-color: #1f1f00; }
        .metric--mb canvas { background-color: #001f1f; }
    `;

    @property() panels: ('fps' | 'ms' | 'mb')[] = ['fps', 'ms', 'mb'];
    @state() private metrics: Metrics = { fps: 0, ms: 0, mb: 0 };
    private frameId?: number;
    private lastTime: number = performance.now();
    private frames: number = 0;
    private canvasContexts: { [key: string]: CanvasRenderingContext2D } = {};
    private history: { [key: string]: number[] } = {
        fps: Array(80).fill(0),
        ms: Array(80).fill(0),
        mb: Array(80).fill(0)
    };

    firstUpdated() {
        this.panels.forEach(panel => {
            const canvas = this.shadowRoot?.querySelector(`#${panel}-canvas`) as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.strokeStyle = panel === 'fps' ? '#00ff00' : panel === 'ms' ? '#ffff00' : '#00ffff';
                    ctx.fillStyle = 'transparent';
                    ctx.lineWidth = 1;
                    this.canvasContexts[panel] = ctx;
                }
            }
        });
    }

    private drawGraphs() {
        this.panels.forEach(panel => {
            const ctx = this.canvasContexts[panel];
            const history = this.history[panel];
            if (ctx) {
                const canvas = ctx.canvas;
                const width = canvas.width;
                const height = canvas.height;

                // Clear canvas
                ctx.clearRect(0, 0, width, height);

                // Draw graph
                ctx.beginPath();
                history.forEach((value, i) => {
                    const x = i * (width / history.length);
                    const y = Math.max(0, height - (value / (
                        panel === 'fps' ? 60 : 
                        panel === 'ms' ? 50 : 
                        1000)) * height);
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.stroke();
            }
        });
    }

    // Frame timing methods
    private frameStartTime: number = 0;

    beginFrame() {
        this.frameStartTime = performance.now();
    }

    endFrame() {
        const frameTime = performance.now() - this.frameStartTime;
        this.frames++;
        
        const now = performance.now();
        if (now >= this.lastTime + 1000) {
            const fps = Math.round(this.frames * 1000 / (now - this.lastTime));
            const ms = frameTime;
            const mb = (performance as any).memory ? 
                Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0;

            // Update metrics
            this.metrics = { fps, ms, mb };

            // Update history
            this.history.fps.push(fps);
            this.history.fps.shift();
            this.history.ms.push(ms);
            this.history.ms.shift();
            this.history.mb.push(mb);
            this.history.mb.shift();

            // Draw graphs
            this.drawGraphs();

            this.frames = 0;
            this.lastTime = now;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.lastTime = performance.now();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
    }

    render() {
        return html`
            <div class="stats-panel">
                ${this.panels.map(panel => html`
                    <div class="metric metric--${panel}">
                        <div class="metric__header">
                            <span class="metric__label">${panel.toUpperCase()}</span>
                            <span class="metric__value">${
                                panel === 'ms' 
                                    ? this.metrics[panel].toFixed(1) 
                                    : Math.round(this.metrics[panel])
                            }</span>
                        </div>
                        <canvas 
                            id="${panel}-canvas"
                            class="metric__canvas"
                            width="80"
                            height="30"
                        ></canvas>
                    </div>
                `)}
            </div>
        `;
    }
}
