import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingItem } from 'src/app/shared/models/booking.model';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  @Input() cart: BookingItem | any;
  @Input() personalDetails: any;
  bookingConfirmationNumber: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Try to get booking confirmation number from URL params
    this.route.queryParams.subscribe(params => {
      if (params['bookingId'] || params['orderId'] || params['confirmationNumber']) {
        this.bookingConfirmationNumber = params['bookingId'] || params['orderId'] || params['confirmationNumber'];
      } else {
        // Generate a temporary confirmation number if not available
        this.bookingConfirmationNumber = this.generateConfirmationNumber();
      }
    });
  }

  generateConfirmationNumber(): string {
    // Generate a temporary confirmation number based on timestamp and hotel ID
    const timestamp = Date.now().toString(36).toUpperCase();
    const hotelId = this.cart?.hotelId || 'BOOK';
    return `${hotelId}${timestamp}`;
  }

  getRoomName(roomList: any, roomID: any): string {
    if (!roomList || !roomID) return '';
    let roomName = '';
    roomList.forEach((element: any) => {
      if (element.roomId == roomID) {
        roomName = element.roomName;
      }
    });
    return roomName;
  }

  getRatePlan(roomList: any, roomID: any, rtID: any): string {
    if (!roomList || !roomID || !rtID) return '';
    let ratePlan = '';
    roomList.forEach((element: any) => {
      if (element.roomId == roomID && element.ratePlanId == rtID) {
        ratePlan = element.ratePlanName;
      }
    });
    return ratePlan;
  }

  getRoomRate(): number {
    if (!this.cart?.rooms || this.cart.rooms.length === 0) return 0;
    const room = this.cart.rooms[0];
    // room.price.actual appears to be total for all nights based on cart-box component
    return room.price?.actual || 0;
  }

  getRoomRatePerNight(): number {
    if (!this.cart?.rooms || this.cart.rooms.length === 0) return 0;
    const room = this.cart.rooms[0];
    const nights = this.cart.noOfDays || 1;
    // Calculate per night rate for display
    return (room.price?.actual || 0) / nights;
  }

  getTotalTax(): number {
    if (!this.cart?.rooms || this.cart.rooms.length === 0) return 0;
    const room = this.cart.rooms[0];
    // taxValue appears to be per night based on cart-box component
    const taxPerNight = room.price?.taxValue || 0;
    const nights = this.cart.noOfDays || 1;
    return taxPerNight * nights;
  }

  calculateAddonPrice(addon: any): number {
    if (!addon || !this.cart) return 0;
    
    // Check if it's per booking (flat cost) or per guest (adult/child values)
    if ((addon.adultValue === 0 || !addon.adultValue) && (addon.childValue === 0 || !addon.childValue)) {
      // Per booking - use flat cost
      return parseFloat(String(addon.cost || 0)) * (addon.qty || 1);
    }
    
    // Per guest - calculate based on adultValue and childValue
    const noOfAdults = this.cart.noOfAdults || 0;
    const noOfChildren = this.cart.noOfChildren || 0;
    
    const adultCost = (addon.adultValue || 0) * noOfAdults;
    const childCost = (addon.childValue || 0) * noOfChildren;
    
    return (adultCost + childCost) * (addon.qty || 1);
  }

  getTotalAmount(): number {
    if (!this.cart) return 0;
    // Use the same calculation as cart-box component
    // cart.totalAmount already includes room price and tax
    const baseTotal = this.cart.totalAmount || 0;
    const addonTotal = this.cart.addonTotalPrice || 0;
    const promoDiscount = this.cart.promoDiscount || 0;
    return baseTotal + addonTotal - promoDiscount;
  }

  getCurrency(): string {
    return this.cart?.rooms?.[0]?.currency || this.cart?.renderData?.currency || 'Rs';
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
}
