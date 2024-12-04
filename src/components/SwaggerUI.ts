import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import 'swagger-ui-dist/swagger-ui.css';
import spec from '../api/openapi.json';

interface SwaggerUIInstance {
    spec: any;
}

export class SwaggerUI {
    private container: HTMLDivElement | null;
    private ui: SwaggerUIInstance | null;
    private containerId: string;
    private visible: boolean;

    constructor(containerId: string) {
        this.container = null;
        this.ui = null;
        this.containerId = containerId;
        this.visible = false;
    }

    initialize(): void {
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
            backButton.style.top = '20px';
            backButton.style.left = '20px';
            backButton.style.zIndex = '1001';
            backButton.style.padding = '10px 20px';
            backButton.style.backgroundColor = '#2196F3';
            backButton.style.color = 'white';
            backButton.style.border = 'none';
            backButton.style.borderRadius = '5px';
            backButton.style.cursor = 'pointer';
            backButton.style.fontSize = '16px';
            backButton.style.fontWeight = 'bold';
            backButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            backButton.style.transition = 'all 0.3s ease';
            backButton.onmouseover = () => {
                backButton.style.backgroundColor = '#1976D2';
                backButton.style.transform = 'translateY(-1px)';
                backButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            };
            backButton.onmouseout = () => {
                backButton.style.backgroundColor = '#2196F3';
                backButton.style.transform = 'translateY(0)';
                backButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            };
            backButton.onclick = () => this.hide();

            this.container.appendChild(backButton);
            document.body.appendChild(this.container);
        }

        // Initialize Swagger UI if not already initialized
        if (!this.ui) {
            this.ui = SwaggerUIBundle({
                spec: spec,
                dom_id: `#${this.containerId}`,
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "BaseLayout"
            }) as SwaggerUIInstance;
        }
    }

    show(): void {
        if (this.container) {
            this.container.style.display = 'block';
            this.visible = true;
        }
    }

    hide(): void {
        if (this.container) {
            this.container.style.display = 'none';
            this.visible = false;
        }
    }

    toggle(): void {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    isVisible(): boolean {
        return this.visible;
    }
}
