import { SpotifyApi, AuthorizationCodeWithPKCEStrategy } from '@spotify/web-api-ts-sdk';

// Get client ID from environment
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = window.location.origin;
const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
];

// Create a singleton instance
export class SpotifyService {
    private static instance: SpotifyService;
    private sdk: SpotifyApi | null = null;

    private constructor() {
        const auth = new AuthorizationCodeWithPKCEStrategy(
            clientId,
            redirectUri,
            scopes
        );
        this.sdk = new SpotifyApi(auth);
    }

    public static getInstance(): SpotifyService {
        if (!SpotifyService.instance) {
            SpotifyService.instance = new SpotifyService();
        }
        return SpotifyService.instance;
    }

    public async authenticate(): Promise<boolean> {
        if (!this.sdk) return false;
        
        try {
            const { authenticated } = await this.sdk.authenticate();
            return authenticated;
        } catch (error) {
            console.error('Authentication error:', error);
            return false;
        }
    }

    public async getPlaylists() {
        if (!this.sdk) return null;
        return await this.sdk.playlists.getUsersPlaylists();
    }

    public async play(uri?: string) {
        if (!this.sdk) return;
        if (uri) {
            await this.sdk.player.startResumePlayback(undefined, undefined, [uri]);
        } else {
            await this.sdk.player.startResumePlayback();
        }
    }

    public async pause() {
        if (!this.sdk) return;
        await this.sdk.player.pausePlayback();
    }

    public async next() {
        if (!this.sdk) return;
        await this.sdk.player.skipToNext();
    }

    public async previous() {
        if (!this.sdk) return;
        await this.sdk.player.skipToPrevious();
    }

    public async getCurrentTrack() {
        if (!this.sdk) return null;
        return await this.sdk.player.getCurrentlyPlayingTrack();
    }

    public async getPlaybackState() {
        if (!this.sdk) return null;
        return await this.sdk.player.getPlaybackState();
    }

    public getSDK(): SpotifyApi | null {
        return this.sdk;
    }
}
