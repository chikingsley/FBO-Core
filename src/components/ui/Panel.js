export class Panel {
    constructor({
        title = '',
        position = { top: '20px', right: '20px' },
        style = {},
        content = null
    } = {}) {
        this.element = document.createElement('div');
        
        // Default styles for the panel container
        const defaultStyle = {
            position: 'fixed',
            padding: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '6px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '1000',
            minWidth: '200px',
            ...position
        };

        // Merge default styles with custom styles
        Object.assign(this.element.style, defaultStyle, style);

        // Create title if provided
        if (title) {
            const titleElement = document.createElement('div');
            Object.assign(titleElement.style, {
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px',
                padding: '4px 8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            });
            titleElement.textContent = title;
            this.element.appendChild(titleElement);
        }

        // Create content container
        this.contentContainer = document.createElement('div');
        Object.assign(this.contentContainer.style, {
            padding: '4px 8px'
        });

        if (content) {
            if (typeof content === 'string') {
                this.contentContainer.innerHTML = content;
            } else if (content instanceof Element) {
                this.contentContainer.appendChild(content);
            }
        }

        this.element.appendChild(this.contentContainer);
        document.body.appendChild(this.element);
    }

    setContent(content) {
        this.contentContainer.innerHTML = '';
        if (typeof content === 'string') {
            this.contentContainer.innerHTML = content;
        } else if (content instanceof Element) {
            this.contentContainer.appendChild(content);
        }
    }

    setStyle(style) {
        Object.assign(this.element.style, style);
    }

    remove() {
        this.element.remove();
    }
}
