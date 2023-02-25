import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';
import { BookingCart } from 'src/app/shared/models/booking.model';

@Component({
  selector: 'app-ongoing-bookings',
  templateUrl: './ongoing-bookings.component.html',
  styleUrls: ['./ongoing-bookings.component.css'],
})
export class OngoingBookingsComponent implements OnInit {
  bookingCart$: Observable<BookingCart>;

  constructor(private bookingService: BookingService) {
    this.bookingCart$ = this.bookingService.bookingCart$;
  }

  ngOnInit(): void {}

  remove(i:any){
    this.bookingService.removeCurrentBookingItemFromList(i)

  }
}
