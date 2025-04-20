import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';
import { BookingCart } from 'src/app/shared/models/booking.model';
import { BookingConfigService } from 'src/app/services/bookingid.service';


@Component({
  selector: 'app-ongoing-bookings',
  templateUrl: './ongoing-bookings.component.html',
  styleUrls: ['./ongoing-bookings.component.css'],
})
export class OngoingBookingsComponent implements OnInit {
  bookingCart$: Observable<BookingCart>;

  constructor(private bookingService: BookingService,
    private router:Router,private BookingConfigService:BookingConfigService) {
    this.bookingCart$ = this.bookingService.bookingCart$;
  }

  ngOnInit(): void {}

  remove(i:any){
    this.bookingService.removeCurrentBookingItemFromList(i)

  }

  roomBtnEvent() {
    console.log("go to search")
    // this.router.navigate(['/search'])
    this.router.navigate(['/deals?hotelId='+this.BookingConfigService.getBookingEngineId()])
  }
}
