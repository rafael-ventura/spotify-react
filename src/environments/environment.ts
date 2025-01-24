export const environment = {
  production: true,
  spotify: {
    clientId: '68d1b43e09794d51b64ad4083e57429f',
    redirectUri: 'https://spotify-timeline-hfleosk6h-rafael-venturas-projects-7a5ff573.vercel.app/callback',
    scopes: [
      'user-read-recently-played',
      'user-top-read',
      'playlist-modify-public',
      'playlist-modify-private',
    ].join(' '),
  },
};
