import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookingConfigService {
  bookingEngineId: number | undefined;

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('hotelId');
      if (id) {
        this.bookingEngineId = +id;
        console.log('Updated Booking Engine ID:', this.bookingEngineId);
      }
    });
  }

  getBookingEngineId() {
    return this.bookingEngineId;
  }
}
