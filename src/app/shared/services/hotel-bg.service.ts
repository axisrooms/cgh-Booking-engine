import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HotelBgService {
  private images = [
    'assets/images/hotels/hotel-1.svg',
    'assets/images/hotels/hotel-2.svg',
    'assets/images/hotels/hotel-3.svg',
    'assets/images/hotels/hotel-4.svg'
  ];

  /**
   * Returns a relative URL for a hotel image based on the bookingEngineId.
   * If id is undefined or invalid, returns the first image.
   */
  getImageForId(id?: number): string {
    const validId = typeof id === 'number' && !isNaN(id) ? id : 0;
    const idx = (validId % this.images.length + this.images.length) % this.images.length;
    return this.images[idx];
  }
}
