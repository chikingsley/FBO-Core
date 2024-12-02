const CLIENT_ID = 'abce1de2612c41bda903fca02cee34fe';
const REDIRECT_URI = window.location.origin;

// Required scopes for the Spotify Web Playback SDK
const SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state'
];

class SpotifyAuth {
    constructor() {
        this.accessToken = null;
        this.checkCallback();
    }

    checkCallback() {
        // Check if we're returning from Spotify auth
        const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce((initial, item) => {
                if (item) {
                    const parts = item.split('=');
                    initial[parts[0]] = decodeURIComponent(parts[1]);
                }
                return initial;
            }, {});

        if (hash.access_token) {
            this.accessToken = hash.access_token;
            // Clear the hash from the URL
            window.location.hash = '';
            // Store token with expiry
            localStorage.setItem('spotify_token', this.accessToken);
            localStorage.setItem('spotify_token_timestamp', Date.now());
            localStorage.setItem('spotify_token_expiry', hash.expires_in);
        }
    }

    getStoredToken() {
        const token = localStorage.getItem('spotify_token');
        const timestamp = localStorage.getItem('spotify_token_timestamp');
        const expiry = localStorage.getItem('spotify_token_expiry');

        if (!token || !timestamp || !expiry) {
            return null;
        }

        // Check if token is expired (with 60s buffer)
        const now = Date.now();
        const expiryTime = parseInt(timestamp) + (parseInt(expiry) * 1000);
        if (now > expiryTime - 60000) {
            this.clearToken();
            return null;
        }

        return token;
    }

    clearToken() {
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_timestamp');
        localStorage.removeItem('spotify_token_expiry');
        this.accessToken = null;
    }

    login() {
        const state = this.generateRandomString(16);
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        
        const params = {
            response_type: 'token',
            client_id: CLIENT_ID,
            scope: SCOPES.join(' '),
            redirect_uri: REDIRECT_URI,
            state: state
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    getAccessToken() {
        if (this.accessToken) {
            return this.accessToken;
        }

        const storedToken = this.getStoredToken();
        if (storedToken) {
            this.accessToken = storedToken;
            return storedToken;
        }

        return null;
    }
}

export default new SpotifyAuth();
