import { Component, OnInit,Input } from '@angular/core';
import { async, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking.service';
import { Reflector } from 'src/app/services/reflector';
import { BookingCart, BookingItem } from '../../models/booking.model';

@Component({
  selector: 'app-cart-box',
  templateUrl: './cart-box.component.html',
  styleUrls: ['./cart-box.component.css'],
})
export class CartBoxComponent implements OnInit {
  bookingCart$: Observable<BookingCart | undefined>;
  bookingItems: BookingItem[] | undefined = []
  currency: any;
  @Input() type:string | undefined
  constructor(private bookingService: BookingService,
    private bookingCartReflect: Reflector<BookingCart>,
    public router: Router,
  ) {
    this.bookingCart$ = this.bookingService.bookingCart$
    this.bookingCart$.subscribe(res => {
      this.bookingItems = res?.bookingItems
      this.currency = res?.bookingItems[0]?.renderData?.currency
    })
  }
  guest:any = localStorage.getItem('guests');
  rooms:any = localStorage.getItem('rooms');
   bookinglength :any;

  ngOnInit(): void {
    console.log("===========================================")
    console.log(this.bookingCart$, this.bookingItems)
    console.log(this.guest)
    console.log()
   this.bookinglength = this.bookingItems?.length;

  }

  getTotal(item: BookingItem[] | undefined = []) {
    const grandTotal = item.reduce((total, item) => {
      let addonTotal = item.addonTotalPrice ? item.addonTotalPrice : 0
      return item.totalAmount + addonTotal + total
    }, 0)
    console.log(grandTotal, "#####")
    return grandTotal;
  }

  remove(i: number) {
    this.bookingService.removeCurrentBookingItemFromList(i)

    console.log(this.bookingItems, this.bookingService)
  }

  getRoomName(roomList: any, roomID: any) {
    let roomName
    roomList.forEach((element: any) => {
      if (element.roomId == roomID) {
        roomName = element.roomName;
      }
    });
    console.log("@@@", roomName)

    return roomName;

  }

  getRatePlan(roomList: any, roomID: any, rtID: any) {
    let ratePlan
    roomList.forEach((element: any) => {
      if (element.roomId == roomID && element.ratePlanId == rtID) {
        ratePlan = element.ratePlanName;
      }
    });
    console.log("@@@", ratePlan)

    return ratePlan;
  }
}
