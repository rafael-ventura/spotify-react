import { Injectable } from '@angular/core';
import { SpotifyTrack } from '../models/spotify.models';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {
  async generatePlaylistImage(tracks: SpotifyTrack[]): Promise<string> {
    // Criar elemento temporário para renderizar a imagem
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.background = '#fff';

    // Adicionar conteúdo
    tracks.forEach(track => {
      const trackElement = document.createElement('div');
      trackElement.style.display = 'flex';
      trackElement.style.alignItems = 'center';
      trackElement.style.marginBottom = '10px';

      const img = document.createElement('img');
      img.src = track.album.images[0].url;
      img.style.width = '60px';
      img.style.height = '60px';

      const info = document.createElement('div');
      info.style.marginLeft = '10px';
      info.innerHTML = `
        <h3 style="margin: 0">${track.name}</h3>
        <p style="margin: 0">${track.artists[0].name}</p>
      `;

      trackElement.appendChild(img);
      trackElement.appendChild(info);
      element.appendChild(trackElement);
    });

    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL('image/png');
      document.body.removeChild(element);
      return image;
    } catch (error) {
      document.body.removeChild(element);
      throw error;
    }
  }
}
