export const environment = {
  production: false,
  spotify: {
    clientId: '68d1b43e09794d51b64ad4083e57429f',
    redirectUri: 'http://localhost:4200/callback',
    scopes: [
      'user-read-recently-played',
      'user-top-read',
      'playlist-modify-public',
      'playlist-modify-private'
    ].join(' ')
  }
};
