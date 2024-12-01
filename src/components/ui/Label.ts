import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const styles = css`
  :host {
    display: block;
  }

  .label {
    padding: 0.5rem 0.75rem;
    background: rgb(0 0 0 / 0.7);
    color: white;
    border-radius: 0.375rem;
    backdrop-filter: blur(4px);
    font-size: 0.75rem;
    font-family: ui-monospace, monospace;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    user-select: none;
  }
`;

@customElement('ui-label')
export class Label extends LitElement {
  static styles = styles;

  @property() text = '';

  render() {
    return html`
      <div class="label">
        ${this.text}
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-label': Label;
  }
}
