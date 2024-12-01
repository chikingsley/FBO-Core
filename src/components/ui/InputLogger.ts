import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('ui-input-logger')
export class InputLogger extends LitElement {
    @state() private lastKey: string = 'None';
    @state() private mousePosition: { x: number, y: number } = { x: 0, y: 0 };
    @state() private mouseInWindow: boolean = false;
    @state() private zValue: number = 0;

    static styles = css`
        :host {
            position: fixed;
            top: 200px;
            right: 0px;
            width: 80px;
            padding: 8px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            background-color: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            backdrop-filter: blur(4px);
        }

        div {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
    `;

    constructor() {
        super();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Key events
        window.addEventListener('keydown', (e) => {
            this.lastKey = e.key;
            this.requestUpdate();
        });

        // Mouse events
        window.addEventListener('mousemove', (e) => {
            this.mousePosition = { x: e.clientX, y: e.clientY };
            this.mouseInWindow = true;
            this.requestUpdate();
        });

        window.addEventListener('mouseout', () => {
            this.mouseInWindow = false;
            this.requestUpdate();
        });

        // Z value update (example - modify based on your needs)
        window.addEventListener('wheel', (e) => {
            this.zValue += e.deltaY * 0.01;
            this.requestUpdate();
        });
    }

    // Method to update Z value
    updateZ(value: number) {
        this.zValue = value;
        this.requestUpdate();
    }

    render() {
        return html`
            <div>
                K:${this.lastKey}<br>
                M:${this.mouseInWindow ? 
                    `${this.mousePosition.x},${this.mousePosition.y}` : 
                    'Out'}<br>
                Z:${this.zValue.toFixed(2)}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ui-input-logger': InputLogger;
    }
}
