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

            // Add back button
            const backButton = document.createElement('button');
            backButton.textContent = '← Back';
            backButton.style.position = 'fixed';
            backButton.style.left = '20px';
            backButton.style.top = '20px';
            backButton.style.padding = '10px 20px';
            backButton.style.fontSize = '16px';
            backButton.style.border = 'none';
            backButton.style.borderRadius = '5px';
            backButton.style.backgroundColor = '#2196F3';
            backButton.style.color = 'white';
            backButton.style.cursor = 'pointer';
            backButton.style.zIndex = '1001';
            backButton.style.display = 'none';
            backButton.style.transition = 'background-color 0.3s';

            backButton.addEventListener('click', () => this.hide());
            backButton.addEventListener('mouseenter', () => {
                backButton.style.backgroundColor = '#1976D2';
            });
            backButton.addEventListener('mouseleave', () => {
                backButton.style.backgroundColor = '#2196F3';
            });

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
            document.body.appendChild(backButton);

            // Initialize Swagger UI with our spec
            this.ui = SwaggerUIBundle({
                spec: spec,
                dom_id: `#${this.containerId}`,
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
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
        // Show both close and back buttons
        const closeButton = document.querySelector('button[style*="right: 20px"]');
        const backButton = document.querySelector('button[style*="left: 20px"]');
        if (closeButton) closeButton.style.display = 'block';
        if (backButton) backButton.style.display = 'block';
        this.visible = true;
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            // Hide both close and back buttons
            const closeButton = document.querySelector('button[style*="right: 20px"]');
            const backButton = document.querySelector('button[style*="left: 20px"]');
            if (closeButton) closeButton.style.display = 'none';
            if (backButton) backButton.style.display = 'none';
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
