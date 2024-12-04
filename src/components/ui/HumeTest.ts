import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { HumeService } from '../../services/hume';
import { SlButton } from '@shoelace-style/shoelace';

const styles = css`
  :host {
    display: block;
    position: fixed;
    bottom: 180px;
    left: 20px;
    z-index: 1000;
  }

  .result {
    margin-top: 8px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    max-height: 200px;
    overflow: auto;
    font-family: monospace;
    font-size: 12px;
  }

  .error {
    color: #e22134;
    margin-top: 8px;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.8);
    padding: 8px;
    border-radius: 4px;
  }
`;

@customElement('ui-hume-test')
export class HumeTest extends LitElement {
    static styles = [SlButton.styles, styles];

    @state() private result: any = null;
    @state() private loading: boolean = false;
    @state() private error: string | null = null;

    private async testHume() {
        const hume = HumeService.getInstance();
        this.loading = true;
        this.error = null;
        
        try {
            // Test facial expressions
            const emotions = await hume.analyzeFacialExpressions([
                'https://hume-tutorials.s3.amazonaws.com/faces.zip'
            ]);
            this.result = emotions;
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Unknown error occurred';
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <sl-button 
                variant="primary"
                size="medium"
                ?loading=${this.loading}
                @click=${this.testHume}
            >
                Test Hume API
            </sl-button>

            ${this.error ? html`
                <div class="error">
                    ${this.error}
                </div>
            ` : ''}

            ${this.result ? html`
                <pre class="result">
                    ${JSON.stringify(this.result, null, 2)}
                </pre>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ui-hume-test': HumeTest;
    }
}
