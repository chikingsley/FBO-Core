import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import 'swagger-ui-dist/swagger-ui.css';
import spec from '../api/openapi.json';

export class SwaggerUI {
    constructor(containerId) {
        this.container = null;
        this.ui = null;
        this.containerId = containerId;
        this.visible = false;
    }

    initialize() {
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.containerId;
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.container.style.zIndex = '1000';
            this.container.style.display = 'none';
            this.container.style.overflow = 'auto';

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.position = 'fixed';
            closeButton.style.right = '20px';
            closeButton.style.top = '20px';
            closeButton.style.fontSize = '24px';
            closeButton.style.width = '40px';
            closeButton.style.height = '40px';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '50%';
            closeButton.style.backgroundColor = '#34495e';
            closeButton.style.color = 'white';
            closeButton.style.cursor = 'pointer';
            closeButton.style.zIndex = '1001';
            closeButton.style.display = 'none';
            closeButton.addEventListener('click', () => this.hide());
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.backgroundColor = '#2c3e50';
            });
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.backgroundColor = '#34495e';
            });

            document.body.appendChild(closeButton);
            document.body.appendChild(this.container);

            // Initialize Swagger UI with our spec
            this.ui = SwaggerUIBundle({
                dom_id: `#${this.containerId}`,
                spec: spec,
                layout: 'BaseLayout',
                presets: [
                    SwaggerUIBundle.presets.apis
                ],
                deepLinking: true,
                displayRequestDuration: true,
                filter: true,
                tryItOutEnabled: true
            });

            // Store close button reference
            this.closeButton = closeButton;
        }
    }

    show() {
        if (!this.container) {
            this.initialize();
        }
        this.container.style.display = 'block';
        this.closeButton.style.display = 'block';
        this.visible = true;
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            this.closeButton.style.display = 'none';
            this.visible = false;
        }
    }

    toggle() {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
}
