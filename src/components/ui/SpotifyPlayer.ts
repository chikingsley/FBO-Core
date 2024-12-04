import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { SpotifyService } from '../../services/spotify';
import type { CurrentlyPlaying } from '@spotify/web-api-ts-sdk';

@customElement('spotify-player')
export class SpotifyPlayer extends LitElement {
    @state() private isPlaying: boolean = false;
    @state() private currentTrack: CurrentlyPlaying | null = null;
    @state() private playerVisible: boolean = false;
    @state() private isAuthenticated: boolean = false;

    private spotify = SpotifyService.getInstance();

    static styles = css`
        :host {
            display: inline-block;
            position: fixed;
            bottom: 120px;
            left: 20px;
            z-index: 1000;
            margin-bottom: 20px;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        button {
            padding: 10px 20px;
            background-color: #1DB954;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 10px;
            font-weight: 500;
        }

        button:hover {
            background-color: #1ed760;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        button:active {
            transform: translateY(0);
        }

        .icon {
            width: 24px;
            height: 24px;
        }

        .player-container {
            background-color: #282828;
            padding: 20px;
            border-radius: 8px;
            color: white;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .track-info {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 16px;
        }

        .track-image {
            width: 60px;
            height: 60px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .track-details {
            flex-grow: 1;
        }

        .track-name {
            font-weight: bold;
            margin-bottom: 4px;
            font-size: 16px;
        }

        .track-artist {
            font-size: 14px;
            opacity: 0.8;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 16px;
        }

        .control-button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .control-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: scale(1.1);
        }

        .control-button:active {
            transform: scale(1);
        }

        .error-message {
            color: #e22134;
            margin-top: 8px;
            font-size: 14px;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.initializePlayer();
    }

    private async initializePlayer() {
        try {
            const isAuthenticated = await this.spotify.authenticate();
            this.isAuthenticated = isAuthenticated;

            if (isAuthenticated) {
                await this.updatePlaybackState();
                // Poll for playback state every 3 seconds
                setInterval(() => this.updatePlaybackState(), 3000);
            }
        } catch (error) {
            console.error('Failed to initialize player:', error);
        }
    }

    private async updatePlaybackState() {
        try {
            const playbackState = await this.spotify.getPlaybackState();
            if (playbackState) {
                this.isPlaying = !playbackState.paused;
                const currentTrack = await this.spotify.getCurrentTrack();
                this.currentTrack = currentTrack;
            }
        } catch (error) {
            console.error('Failed to update playback state:', error);
        }
    }

    private async handleLogin() {
        try {
            const isAuthenticated = await this.spotify.authenticate();
            this.isAuthenticated = isAuthenticated;
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    private async togglePlayback() {
        try {
            if (this.isPlaying) {
                await this.spotify.pause();
            } else {
                await this.spotify.play();
            }
            await this.updatePlaybackState();
        } catch (error) {
            console.error('Failed to toggle playback:', error);
        }
    }

    private async skipNext() {
        try {
            await this.spotify.next();
            await this.updatePlaybackState();
        } catch (error) {
            console.error('Failed to skip to next track:', error);
        }
    }

    private async skipPrevious() {
        try {
            await this.spotify.previous();
            await this.updatePlaybackState();
        } catch (error) {
            console.error('Failed to skip to previous track:', error);
        }
    }

    private togglePlayer() {
        this.playerVisible = !this.playerVisible;
    }

    render() {
        if (!this.isAuthenticated) {
            return html`
                <button @click=${this.handleLogin}>
                    <svg class="icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Connect Spotify
                </button>
            `;
        }

        return html`
            <button @click=${this.togglePlayer}>
                <svg class="icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                ${this.isPlaying ? 'Now Playing' : 'Play Music'}
            </button>
            ${this.playerVisible && this.currentTrack ? html`
                <div class="player-container">
                    <div class="track-info">
                        ${this.currentTrack.item?.album.images[0]?.url ? html`
                            <img class="track-image" 
                                src=${this.currentTrack.item.album.images[0].url} 
                                alt="Album art">
                        ` : ''}
                        <div class="track-details">
                            <div class="track-name">${this.currentTrack.item?.name || 'Unknown Track'}</div>
                            <div class="track-artist">
                                ${this.currentTrack.item?.artists.map(a => a.name).join(', ') || 'Unknown Artist'}
                            </div>
                        </div>
                    </div>
                    <div class="controls">
                        <button class="control-button" @click=${this.skipPrevious}>⏮</button>
                        <button class="control-button" @click=${this.togglePlayback}>
                            ${this.isPlaying ? '⏸' : '▶'}
                        </button>
                        <button class="control-button" @click=${this.skipNext}>⏭</button>
                        <button class="control-button" @click=${this.shuffle}>🔀</button>
                        <button class="control-button" @click=${this.repeat}>🔁</button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    private async shuffle() {
        try {
            await this.spotify.shuffle();
        } catch (error) {
            console.error('Failed to shuffle:', error);
        }
    }

    private async repeat() {
        try {
            await this.spotify.repeat();
        } catch (error) {
            console.error('Failed to repeat:', error);
        }
    }
}
