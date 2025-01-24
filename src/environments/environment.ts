export const environment = {
  production: true,
  spotify: {
    clientId: '68d1b43e09794d51b64ad4083e57429f',
    redirectUri: 'https://spotify-timeline-eight.vercel.app/callback',
    scopes: [
      'user-read-recently-played',
      'user-top-read',
      'playlist-modify-public',
      'playlist-modify-private',
    ].join(' '),
  },
};
