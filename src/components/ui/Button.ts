import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SlButton } from '@shoelace-style/shoelace';

const styles = css`
  :host {
    --sl-border-radius-medium: 0.375rem;
    --sl-color-primary-500: rgb(23 23 23); /* neutral-900 */
    --sl-color-primary-600: rgb(23 23 23 / 0.9); /* neutral-900/90 */
    --sl-color-danger-500: rgb(239 68 68); /* red-500 */
    --sl-color-danger-600: rgb(239 68 68 / 0.9); /* red-500/90 */
    --sl-color-neutral-100: rgb(245 245 245); /* neutral-100 */
    --sl-color-neutral-200: rgb(229 229 229); /* neutral-200 */
    --sl-color-neutral-800: rgb(38 38 38); /* neutral-800 */
    --sl-color-neutral-900: rgb(23 23 23); /* neutral-900 */
    --sl-color-neutral-950: rgb(10 10 10); /* neutral-950 */
  }

  sl-button::part(base) {
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.15s;
  }

  sl-button::part(base):focus-visible {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
  }

  sl-button[disabled]::part(base) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Size variants */
  sl-button[size="small"]::part(base) {
    height: 2.25rem;
    padding: 0 0.75rem;
  }

  sl-button[size="default"]::part(base) {
    height: 2.5rem;
    padding: 0 1rem;
  }

  sl-button[size="large"]::part(base) {
    height: 2.75rem;
    padding: 0 2rem;
  }

  /* Variant styles */
  sl-button[variant="default"]::part(base) {
    background-color: var(--sl-color-primary-500);
    color: white;
  }

  sl-button[variant="default"]::part(base):hover {
    background-color: var(--sl-color-primary-600);
  }

  sl-button[variant="destructive"]::part(base) {
    background-color: var(--sl-color-danger-500);
    color: white;
  }

  sl-button[variant="destructive"]::part(base):hover {
    background-color: var(--sl-color-danger-600);
  }

  sl-button[variant="outline"]::part(base) {
    border: 1px solid var(--sl-color-neutral-200);
    background-color: white;
  }

  sl-button[variant="outline"]::part(base):hover {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-900);
  }

  sl-button[variant="ghost"]::part(base) {
    background-color: transparent;
  }

  sl-button[variant="ghost"]::part(base):hover {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-900);
  }

  /* Dark mode */
  :host([data-theme="dark"]) sl-button[variant="default"]::part(base) {
    background-color: var(--sl-color-neutral-50);
    color: var(--sl-color-neutral-900);
  }

  :host([data-theme="dark"]) sl-button[variant="outline"]::part(base) {
    border-color: var(--sl-color-neutral-800);
    background-color: var(--sl-color-neutral-950);
  }

  :host([data-theme="dark"]) sl-button[variant="outline"]::part(base):hover {
    background-color: var(--sl-color-neutral-800);
    color: white;
  }

  :host([data-theme="dark"]) sl-button[variant="ghost"]::part(base):hover {
    background-color: var(--sl-color-neutral-800);
    color: white;
  }
`;

@customElement('ui-button')
export class Button extends SlButton {
  static styles = [SlButton.styles, styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': Button;
  }
}
