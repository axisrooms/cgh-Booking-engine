import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookingConfigService {
  bookingEngineId: number | undefined;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('hotelId');
      console.log('Updated Booking Engine ID:', id);
      if (id) {
        this.bookingEngineId = +id;
        console.log('Updated Booking Engine ID:', this.bookingEngineId);
      }
    });
  }

  getBookingEngineId() {
    return Number(this.bookingEngineId);
  }
}
