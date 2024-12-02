import { LitElement, html, css } from 'lit';
import SpotifyAuth from '../../services/SpotifyAuth.js';

const styles = css`
  :host {
    display: inline-block;
    position: fixed;
    bottom: 120px;
    left: 20px;
    z-index: 1000;
  }

  button {
    padding: 10px 20px;
    background-color: #1DB954;  // Spotify green
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button:hover {
    background-color: #1ed760;  // Lighter Spotify green
  }

  .icon {
    font-size: 1.2em;
  }

  .player-container {
    position: fixed;
    bottom: 80px;
    left: 20px;
    background-color: #282828;
    padding: 15px;
    border-radius: 8px;
    display: none;
    min-width: 250px;
  }

  .player-container.visible {
    display: block;
  }

  .track-info {
    color: white;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .track-name {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .track-artist {
    opacity: 0.8;
  }

  .controls {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .control-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.3s;
    font-size: 18px;
  }

  .control-button:hover {
    background-color: #404040;
  }

  .login-message {
    color: white;
    text-align: center;
    margin: 10px 0;
  }

  .login-button {
    background-color: #1DB954;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    width: 100%;
  }

  .login-button:hover {
    background-color: #1ed760;
  }
`;

export class SpotifyPlayer extends LitElement {
  static styles = styles;

  static properties = {
    isPlaying: { type: Boolean },
    currentTrack: { type: Object },
    playerVisible: { type: Boolean },
    deviceId: { type: String },
    isLoggedIn: { type: Boolean }
  };

  constructor() {
    super();
    this.isPlaying = false;
    this.currentTrack = null;
    this.playerVisible = false;
    this.deviceId = null;
    this.player = null;
    this.isLoggedIn = false;
  }

  async firstUpdated() {
    // Check if user is already logged in
    const token = SpotifyAuth.getAccessToken();
    if (token) {
      this.isLoggedIn = true;
      this.initializeSDK();
    }
  }

  async initializeSDK() {
    // Load Spotify Web Playback SDK if not already loaded
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        this.initializePlayer();
      };
    } else {
      this.initializePlayer();
    }
  }

  async initializePlayer() {
    const token = SpotifyAuth.getAccessToken();
    if (!token) {
      console.error('No access token available');
      return;
    }

    this.player = new Spotify.Player({
      name: 'FBO Miracle',
      getOAuthToken: cb => cb(token)
    });

    // Error handling
    this.player.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize:', message);
    });

    this.player.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate:', message);
      this.isLoggedIn = false;
      SpotifyAuth.clearToken();
      this.requestUpdate();
    });

    this.player.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account:', message);
    });

    this.player.addListener('playback_error', ({ message }) => {
      console.error('Failed to perform playback:', message);
    });

    // Playback status updates
    this.player.addListener('player_state_changed', state => {
      if (state) {
        this.isPlaying = !state.paused;
        this.currentTrack = {
          name: state.track_window.current_track.name,
          artist: state.track_window.current_track.artists[0].name
        };
        this.requestUpdate();
      }
    });

    // Ready
    this.player.addListener('ready', ({ device_id }) => {
      this.deviceId = device_id;
      console.log('Ready with Device ID', device_id);
    });

    // Connect to the player
    await this.player.connect();
  }

  async togglePlay() {
    if (!this.player) return;
    await this.player.togglePlay();
  }

  async previousTrack() {
    if (!this.player) return;
    await this.player.previousTrack();
  }

  async nextTrack() {
    if (!this.player) return;
    await this.player.nextTrack();
  }

  togglePlayer() {
    this.playerVisible = !this.playerVisible;
  }

  login() {
    SpotifyAuth.login();
  }

  renderPlayer() {
    if (!this.isLoggedIn) {
      return html`
        <div class="login-message">
          Connect to Spotify to play music
        </div>
        <button class="login-button" @click=${this.login}>
          Connect Spotify
        </button>
      `;
    }

    return html`
      ${this.currentTrack ? html`
        <div class="track-info">
          <div class="track-name">${this.currentTrack.name}</div>
          <div class="track-artist">${this.currentTrack.artist}</div>
        </div>
      ` : ''}
      <div class="controls">
        <button class="control-button" @click=${this.previousTrack}>⏮</button>
        <button class="control-button" @click=${this.togglePlay}>
          ${this.isPlaying ? '⏸' : '▶️'}
        </button>
        <button class="control-button" @click=${this.nextTrack}>⏭</button>
      </div>
    `;
  }

  render() {
    return html`
      <button @click=${this.togglePlayer}>
        <span class="icon">🎵</span>
        <span>Spotify</span>
      </button>
      <div class="player-container ${this.playerVisible ? 'visible' : ''}">
        ${this.renderPlayer()}
      </div>
    `;
  }
}

customElements.define('ui-spotify-player', SpotifyPlayer);
