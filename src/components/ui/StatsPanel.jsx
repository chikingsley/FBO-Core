import React, { useState, useEffect, useRef } from 'react';
import Panel from './Panel';
import Label from './Label';

const StatsPanel = ({ 
  position = { top: '0px', right: '0px' },
  panels = ['fps', 'ms', 'mb'] 
}) => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    ms: 0,
    mb: 0
  });
  
  const frameRef = useRef();
  const lastTimeRef = useRef(performance.now());
  const framesRef = useRef(0);

  useEffect(() => {
    let active = true;

    const updateMetrics = () => {
      if (!active) return;

      const now = performance.now();
      framesRef.current++;

      // Update every second
      if (now >= lastTimeRef.current + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(framesRef.current * 1000 / (now - lastTimeRef.current)),
          ms: Math.round(now - lastTimeRef.current) / framesRef.current,
          mb: Math.round(performance.memory?.usedJSHeapSize / 1048576) || 0
        }));

        framesRef.current = 0;
        lastTimeRef.current = now;
      }

      frameRef.current = requestAnimationFrame(updateMetrics);
    };

    frameRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      active = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const getPanelTarget = type => ({
    fps: '>40',
    ms: '<25',
    mb: '<10'
  }[type] || '');

  const getPanelLabel = type => ({
    fps: 'FPS',
    ms: 'MS',
    mb: 'MB'
  }[type] || type.toUpperCase());

  // Example of using Label for additional info
  const showDetailedStats = metrics.fps < 30;

  return (
    <>
      <Panel 
        variant="stats"
        position={position}
        className="space-y-1"
      >
        {panels.map(type => (
          <div 
            key={type}
            className="bg-black/20 rounded p-1"
          >
            <div className="flex justify-between text-xs font-mono p-1 bg-black/50 rounded mb-0.5">
              <span>{getPanelLabel(type)}</span>
              <span className="text-green-400 ml-2">{getPanelTarget(type)}</span>
            </div>
            <div className="text-center font-mono text-sm">
              {metrics[type]?.toFixed(1)}
            </div>
          </div>
        ))}
      </Panel>

      {/* Optional performance warning using Label */}
      {showDetailedStats && (
        <Label
          text="Low FPS - Performance Issues Detected"
          position={{ bottom: '20px', right: '20px' }}
          className="bg-red-500/70"
        />
      )}
    </>
  );
};

StatsPanel.displayName = "StatsPanel";

export default StatsPanel;