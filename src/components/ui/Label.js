export class Label {
    constructor({
        text = '',
        position = { top: '20px', left: '20px' },
        style = {}
    } = {}) {
        this.element = document.createElement('div');
        
        // Default styles
        const defaultStyle = {
            position: 'fixed',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            backdropFilter: 'blur(4px)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            userSelect: 'none',
            ...position
        };

        // Merge default styles with custom styles
        Object.assign(this.element.style, defaultStyle, style);
        
        this.element.textContent = text;
        document.body.appendChild(this.element);
    }

    setText(text) {
        this.element.textContent = text;
    }

    setStyle(style) {
        Object.assign(this.element.style, style);
    }

    setHTML(html) {
        this.element.innerHTML = html;
    }

    remove() {
        this.element.remove();
    }
}
