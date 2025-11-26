import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class BookingConfigService {
  bookingEngineId: number | undefined;


constructor(private route: ActivatedRoute) {
  this.route.queryParamMap.subscribe(params => {
    const hotelId = params.get('hotelId'); // Now reads from query params
  
    
    if (hotelId) {
      this.bookingEngineId = +hotelId; // Convert to number
    }
  });
}
  getBookingEngineId() {
    // If bookingEngineId is not set or is not a valid number, fall back to the
    // default BOOKING_ENGINE_ID from constants to avoid NaN in query params.
    if (this.bookingEngineId != null && !isNaN(this.bookingEngineId)) {
      return Number(this.bookingEngineId);
    }
    return BOOKING_ENGINE_ID;
  }
}
