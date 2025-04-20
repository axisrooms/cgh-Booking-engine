import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookingConfigService {
  bookingEngineId: number | undefined;


constructor(private route: ActivatedRoute) {
  this.route.queryParamMap.subscribe(params => {
    const hotelId = params.get('hotelId'); // Now reads from query params
    console.log('Hotel ID from queryParams:', hotelId);
    
    if (hotelId) {
      this.bookingEngineId = +hotelId; // Convert to number
      console.log('Updated Booking Engine ID:', this.bookingEngineId);
    }
  });
}
  getBookingEngineId() {
    return Number(this.bookingEngineId);
  }
}
