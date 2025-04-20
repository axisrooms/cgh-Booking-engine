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
  
    
    if (hotelId) {
      this.bookingEngineId = +hotelId; // Convert to number
    }
  });
}
  getBookingEngineId() {
    return Number(this.bookingEngineId);
  }
}
