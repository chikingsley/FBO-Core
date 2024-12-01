import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

const styles = css`
  :host {
    display: inline-block;
  }

  .api-docs-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .api-docs-button__icon {
    width: 1rem;
    height: 1rem;
  }
`;

@customElement('ui-api-docs-button')
export class ApiDocsButton extends LitElement {
  static styles = styles;

  private handleClick() {
    this.dispatchEvent(new CustomEvent('toggle'));
  }

  render() {
    return html`
      <ui-button
        variant="secondary"
        size="small"
        @click=${this.handleClick}
      >
        <div class="api-docs-button">
          <svg 
            class="api-docs-button__icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span>API Docs</span>
        </div>
      </ui-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-api-docs-button': ApiDocsButton;
  }
}
