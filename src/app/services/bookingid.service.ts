import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookingConfigService {
  bookingEngineId: number | undefined;

  constructor(private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('hotelId');
    console.log('Hotel ID:', id);
    if (id) {
      this.bookingEngineId = +id;
      console.log('Updated Booking Engine ID:', this.bookingEngineId);
    }
  }

  getBookingEngineId() {
    return Number(this.bookingEngineId);
  }
}
