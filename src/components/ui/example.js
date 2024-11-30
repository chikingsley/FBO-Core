import { Button, Label, Panel, StatsPanel } from './index.js';

// Create a button
const button = new Button({
    text: 'Click Me',
    position: { bottom: '20px', left: '20px' },
    onClick: () => console.log('Button clicked!'),
    style: {
        backgroundColor: '#4CAF50',
        hoverColor: '#45a049'
    }
});

// Create a label
const label = new Label({
    text: 'Status: Active',
    position: { top: '20px', left: '20px' },
    style: {
        backgroundColor: 'rgba(76, 175, 80, 0.8)'
    }
});

// Create a panel
const panel = new Panel({
    title: 'Information Panel',
    position: { top: '20px', right: '220px' },
    content: `
        <div style="color: #fff; font-family: monospace;">
            <p>System Status: Online</p>
            <p>Memory Usage: 45%</p>
            <p>CPU Load: 23%</p>
        </div>
    `
});

// Create a stats panel
const statsPanel = new StatsPanel({
    position: { top: '0px', right: '0px' },
    panels: ['fps', 'ms', 'mb']
});

// Example of updating components
setTimeout(() => {
    button.setText('Updated!');
    label.setText('Status: Updated');
    panel.setContent('Content updated at ' + new Date().toLocaleTimeString());
}, 3000);
