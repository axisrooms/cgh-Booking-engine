import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
// import { Router } from 'express';
import { Observable } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-notification',
  templateUrl: './booking-notification.component.html',
  styleUrls: ['./booking-notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingNotificationComponent implements OnInit {
  bookingCart$: Observable<any>;

  constructor(private bookingService: BookingService,
    private route :Router) {
    this.bookingCart$ = this.bookingService.bookingCart$;
  }

  ngOnInit(): void {}

  goToBookingsPage() {
    // this.bookingService.navigateToBookingWithoutSpecifyingIndex();
    this.route.navigateByUrl('cart')
  }
}
