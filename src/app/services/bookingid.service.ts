import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingConfigService {
  private bookingEngineId: number | undefined;

  constructor(private router: Router) {
    // Initialize from current URL
    this.updateBookingEngineIdFromUrl();

    // Subscribe to router events to catch manual URL changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBookingEngineIdFromUrl();
    });
  }

  private updateBookingEngineIdFromUrl(): void {
    // Parse query parameters from current URL
    const urlTree = this.router.parseUrl(this.router.url);
    const queryParams = urlTree.queryParams;
    
    // Get bookingEngineId from query parameters
    const bookingEngineId = queryParams['bookingEngineId'];
    
    if (bookingEngineId) {
      this.bookingEngineId = +bookingEngineId; // Convert to number
      console.log('BookingEngineId updated from URL:', this.bookingEngineId);
    } else {
      // Reset to default if no parameter found
      this.bookingEngineId = BOOKING_ENGINE_ID;
      console.log('BookingEngineId reset to default:', this.bookingEngineId);
    }
  }

  getBookingEngineId(): number {
    // If bookingEngineId is not set or is not a valid number, fall back to the
    // default BOOKING_ENGINE_ID from constants to avoid NaN in query params.
    if (this.bookingEngineId != null && !isNaN(this.bookingEngineId)) {
      return Number(this.bookingEngineId);
    }
    return BOOKING_ENGINE_ID;
  }
}
