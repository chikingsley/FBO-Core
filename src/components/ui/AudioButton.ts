import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const styles = css`
  :host {
    display: inline-block;
  }

  .audio-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .audio-button__icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .audio-button__visualizer {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 1rem;
  }

  .audio-button__bar {
    width: 2px;
    height: var(--height, 4px);
    background-color: currentColor;
    transition: height 0.15s ease;
  }

  @keyframes bounce {
    0%, 100% { height: 4px; }
    50% { height: 12px; }
  }

  .audio-button__bar.active {
    animation: bounce 0.5s ease infinite;
  }

  .audio-button__bar:nth-child(2) { animation-delay: 0.1s; }
  .audio-button__bar:nth-child(3) { animation-delay: 0.2s; }
  .audio-button__bar:nth-child(4) { animation-delay: 0.3s; }
`;

@customElement('ui-audio-button')
export class AudioButton extends LitElement {
  static styles = styles;

  @property() active = false;
  @property() label = 'Toggle Audio';

  render() {
    return html`
      <ui-button
        variant="ghost"
        size="default"
        @click=${() => this.active = !this.active}
      >
        <div class="audio-button">
          ${this.active ? html`
            <svg class="audio-button__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          ` : html`
            <svg class="audio-button__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          `}
          ${this.label}
          <div class="audio-button__visualizer">
            <div class="audio-button__bar ${this.active ? 'active' : ''}"></div>
            <div class="audio-button__bar ${this.active ? 'active' : ''}"></div>
            <div class="audio-button__bar ${this.active ? 'active' : ''}"></div>
            <div class="audio-button__bar ${this.active ? 'active' : ''}"></div>
          </div>
        </div>
      </ui-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-audio-button': AudioButton;
  }
}
