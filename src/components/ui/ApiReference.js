import { LitElement, html, css } from 'lit';
import { SwaggerUI } from '../SwaggerUI.js';

const styles = css`
  :host {
    display: inline-block;
    position: fixed;
    bottom: 70px;
    left: 20px;
    z-index: 1000;
  }

  button {
    padding: 10px 20px;
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button:hover {
    background-color: #1976D2;
  }

  .icon {
    font-size: 1.2em;
  }
`;

export class ApiReference extends LitElement {
  static styles = styles;

  constructor() {
    super();
    this.swaggerUI = new SwaggerUI('swagger-ui');
    this.swaggerUI.initialize();
  }

  handleClick() {
    this.swaggerUI.toggle();
  }

  render() {
    return html`
      <button @click=${this.handleClick}>
        <span class="icon">📚</span>
        <span>API Reference</span>
      </button>
    `;
  }
}

customElements.define('ui-api-reference', ApiReference);
