import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Panel } from './Panel.js';

export class StatsPanel extends Panel {
    constructor({
        position = { top: '0px', right: '0px' },
        style = {},
        panels = ['fps', 'ms', 'mb']
    } = {}) {
        super({
            position,
            style: {
                backgroundColor: 'transparent',
                padding: '10px',
                ...style
            }
        });

        this.statsInstances = [];
        this.statsGroups = [];

        // Create stats instances for each requested panel
        panels.forEach((panelType, index) => {
            const stats = new Stats();
            stats.showPanel(this.getPanelIndex(panelType));
            stats.dom.style.position = 'relative';
            this.statsInstances.push(stats);

            // Create a group for each stats instance
            const group = this.createStatsGroup(
                this.getPanelLabel(panelType),
                this.getPanelTarget(panelType),
                stats
            );
            this.statsGroups.push(group);
            this.contentContainer.appendChild(group);
        });

        // Start update loop
        this.animate();
    }

    getPanelIndex(type) {
        const panels = {
            fps: 0,
            ms: 1,
            mb: 2
        };
        return panels[type] || 0;
    }

    getPanelLabel(type) {
        const labels = {
            fps: 'FPS',
            ms: 'MS',
            mb: 'MB'
        };
        return labels[type] || type.toUpperCase();
    }

    getPanelTarget(type) {
        const targets = {
            fps: '>40',
            ms: '<25',
            mb: '<10'
        };
        return targets[type] || '';
    }

    createStatsGroup(label, target, stats) {
        const group = document.createElement('div');
        Object.assign(group.style, {
            marginBottom: '4px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
            padding: '4px'
        });

        const labelElem = document.createElement('div');
        Object.assign(labelElem.style, {
            display: 'flex',
            justifyContent: 'space-between',
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
            padding: '2px 4px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '2px',
            marginBottom: '2px',
            backdropFilter: 'blur(4px)'
        });

        const nameSpan = document.createElement('span');
        nameSpan.textContent = label;

        const targetSpan = document.createElement('span');
        targetSpan.textContent = target;
        targetSpan.style.color = '#8f8';
        targetSpan.style.marginLeft = '8px';

        labelElem.appendChild(nameSpan);
        labelElem.appendChild(targetSpan);
        group.appendChild(labelElem);
        group.appendChild(stats.dom);

        return group;
    }

    animate = () => {
        this.statsInstances.forEach(stats => stats.update());
        requestAnimationFrame(this.animate);
    }

    remove() {
        cancelAnimationFrame(this.animate);
        super.remove();
    }
}
