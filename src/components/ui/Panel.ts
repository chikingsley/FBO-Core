import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const styles = css`
  :host {
    --panel-bg: rgb(255 255 255 / 0.8);
    --panel-border: rgb(229 229 229);
    --panel-shadow: rgb(0 0 0 / 0.1);
  }

  .panel {
    position: relative;
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 var(--panel-shadow);
    backdrop-filter: blur(8px);
    padding: 1rem;
  }

  .panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .panel__title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--sl-color-neutral-900);
    margin: 0;
  }

  .panel__content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Dark mode */
  :host([data-theme="dark"]) {
    --panel-bg: rgb(0 0 0 / 0.8);
    --panel-border: rgb(38 38 38);
    --panel-shadow: rgb(0 0 0 / 0.5);
  }

  :host([data-theme="dark"]) .panel__title {
    color: white;
  }
`;

@customElement('ui-panel')
export class Panel extends LitElement {
  static styles = styles;

  @property() title = '';
  @property() collapsible = false;
  @property() collapsed = false;

  render() {
    return html`
      <div class="panel">
        ${this.title ? html`
          <div class="panel__header">
            <h3 class="panel__title">${this.title}</h3>
            ${this.collapsible ? html`
              <ui-button
                variant="ghost"
                size="small"
                @click=${() => this.collapsed = !this.collapsed}
              >
                ${this.collapsed ? 'Expand' : 'Collapse'}
              </ui-button>
            ` : ''}
          </div>
        ` : ''}
        <div class="panel__content" ?hidden=${this.collapsed}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-panel': Panel;
  }
}
