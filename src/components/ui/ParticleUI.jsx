import React from 'react'
import { StatsPanel } from './StatsPanel'
import { ApiDocsButton } from './ApiDocsButton'
import { AudioButton } from './AudioButton'
import { cn } from '../../lib/utils'

const ParticleUI = ({ onApiDocsToggle, onAudioStart, onAudioStop, className }) => {
    return (
        <div className={cn('fixed inset-0 pointer-events-none', className)}>
            <StatsPanel 
                position={{ top: '20px', right: '20px' }}
                panels={['fps', 'ms', 'mb']}
            />
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto">
                <ApiDocsButton 
                    onToggle={onApiDocsToggle}
                    className="relative"
                />
                <AudioButton 
                    onAudioStart={onAudioStart}
                    onAudioStop={onAudioStop}
                    className="relative"
                />
            </div>
        </div>
    )
}

export default ParticleUI
