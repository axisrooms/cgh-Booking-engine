import { Component, OnInit,Input } from '@angular/core';
import { async, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking.service';
import { Reflector } from 'src/app/services/reflector';
import { BookingCart, BookingItem } from '../../models/booking.model';
import { BookingConfigService } from 'src/app/services/bookingid.service';


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
    public BookingConfigService: BookingConfigService
  ) {
    this.bookingCart$ = this.bookingService.bookingCart$
    this.bookingCart$.subscribe(res => {
      this.bookingItems = res?.bookingItems
      this.currency = res?.bookingItems && res.bookingItems.length > 0 
        ? res.bookingItems[0]?.renderData?.currency 
        : '';
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
      let promoDiscount = item.promoDiscount ? item.promoDiscount : 0
      return item.totalAmount + addonTotal - promoDiscount + total
    }, 0)
    console.log(grandTotal, "#####")
    return grandTotal;
  }

  remove(i: number) {
    this.bookingService.removeCurrentBookingItemFromList(i)
     this.bookingService.count--;
     this.bookingService.addflag =false;
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

  // Calculate addon price based on policy type
  calculateAddonPrice(addon: any, bookingItem: BookingItem): number {
    // Check if it's per booking (flat cost) or per guest (adult/child values)
    if ((addon.adultValue === 0 || !addon.adultValue) && (addon.childValue === 0 || !addon.childValue)) {
      // Per booking - use flat cost
      return parseFloat(addon.cost || 0) * (addon.qty || 1);
    }
    
    // Per guest - use selectedAdults/selectedChildren/selectedNights if available
    const noOfAdults = addon.selectedAdults !== undefined ? addon.selectedAdults : (bookingItem.noOfAdults || 0);
    const noOfChildren = addon.selectedChildren !== undefined ? addon.selectedChildren : (bookingItem.noOfChildren || 0);
    const noOfNights = addon.selectedNights !== undefined ? addon.selectedNights : 1;
    
    const adultCost = (addon.adultValue || 0) * noOfAdults;
    const childCost = (addon.childValue || 0) * noOfChildren;
    
    return (adultCost + childCost) * noOfNights * (addon.qty || 1);
  }

  // Filter addons with qty > 0
  getActiveAddons(addons: any[] | undefined): any[] {
    if (!addons) return [];
    return addons.filter(addon => addon.qty > 0);
  }

  // Check if there are active addons
  hasActiveAddons(addons: any[] | undefined): boolean {
    if (!addons) return false;
    return addons.some(addon => addon.qty > 0);
  }

  // Get the number of remaining rooms to be selected
  getRemainingRooms(): number {
    const totalRoomsRequested = parseInt(localStorage.getItem('rooms') || '1', 10);
    const roomsInCart = this.bookingItems?.length || 0;
    return Math.max(0, totalRoomsRequested - roomsInCart);
  }

  // Get total rooms required from search selection
  getTotalRoomsRequired(): number {
    return parseInt(localStorage.getItem('rooms') || '1', 10);
  }

  // Get guests count for a specific booking item
  getGuestsForItem(bookingItem: BookingItem): number {
    const adults = bookingItem.noOfAdults || 0;
    const children = bookingItem.noOfChildren || 0;
    return adults + children;
  }

  // Get total guests count for all booking items in cart
  getTotalGuests(): number {
    if (!this.bookingItems) return 0;
    return this.bookingItems.reduce((total, item) => {
      return total + (item.noOfAdults || 0) + (item.noOfChildren || 0);
    }, 0);
  }
}
