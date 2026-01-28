import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BASE_URL, BOOKING_ENGINE_ID, getDefaultHeaders } from '../shared/constants/url.constants';
import { BookingItem, BookingCart, Room } from '../shared/models/booking.model';
import { BookingConfigService } from 'src/app/services/bookingid.service';
import { Reflector } from './reflector';
import * as moment from 'moment';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  readonly bookingCart$: Observable<BookingCart>;
  readonly currBookingItem$: Observable<BookingItem | undefined>;

  bookingCartValue: BookingCart = { bookingItems: [] };
  currBookingItemValue: BookingItem | undefined;
  cartflag:boolean | undefined ;
  addflag:boolean | undefined ;
  count:any | undefined;
  constructor(
    private http: HttpClient,
    private bookingCartReflect: Reflector<BookingCart>,
    private router: Router,
    private BookingConfigService:BookingConfigService,
  ) {
    this.bookingCart$ = this.bookingCartReflect.observe(
      this.bookingCartReflect.HOOKS.BOOKING_CART
    );
    console.log(this.bookingCart$, this.bookingCartReflect.observe(
      this.bookingCartReflect.HOOKS.BOOKING_CART
    ))
    this.currBookingItem$ = this.bookingCart$.pipe(
      map((bookingCart) => {
        return bookingCart &&
          bookingCart.currIndex != undefined &&
          !isNaN(bookingCart.currIndex)
          ? bookingCart.bookingItems?.[bookingCart.currIndex]
          : undefined;
      })
    );
   
    this.bookingCart$.pipe(tap((val) => (this.bookingCartValue = val))).subscribe();
    this.currBookingItem$.pipe(tap((val) => (this.currBookingItemValue = val))).subscribe();
    this.unsetPGLoaderFlag()
  }

  // Check if cart is full (all required rooms are added)
  isCartFull(): boolean {
    const totalRoomsRequired = parseInt(localStorage.getItem('rooms') || '1', 10);
    const roomsInCart = this.bookingCartValue?.bookingItems?.length || 0;
    return roomsInCart >= totalRoomsRequired;
  }

  // Get remaining rooms count
  getRemainingRoomsCount(): number {
    const totalRoomsRequired = parseInt(localStorage.getItem('rooms') || '1', 10);
    const roomsInCart = this.bookingCartValue?.bookingItems?.length || 0;
    return Math.max(0, totalRoomsRequired - roomsInCart);
  }

  initializeNewBooking(bookingItem: BookingItem): boolean {
    // Check if cart is already full
    if (this.isCartFull()) {
      return false; // Indicate that room was not added
    }

    let bookingItems: BookingItem[] = this.bookingCartValue?.bookingItems
      ? [...this.bookingCartValue?.bookingItems]
      : [];

    let bookingCart: BookingCart = {
      bookingItems: [...bookingItems, bookingItem],
      currIndex: this.bookingCartValue?.bookingItems?.length || 0,
    };

    this.bookingCartReflect.set(
      this.bookingCartReflect.HOOKS.BOOKING_CART,
      bookingCart
    );
    
    return true; // Indicate that room was successfully added
  }

  navigateToBookingWithoutSpecifyingIndex() {
    if (
      this.bookingCartValue.bookingItems?.length &&
      this.bookingCartValue.bookingItems?.length > 1
    ) {
      let bookingCart: BookingCart = {
        ...this.bookingCartValue,
        currIndex: undefined,
      };

      this.bookingCartReflect.set(
      this.bookingCartReflect.HOOKS.BOOKING_CART,
      bookingCart
    );
  }
  this.router.navigate(['/book'], { queryParams: { bookingEngineId: this.BookingConfigService.getBookingEngineId() } });
}  getTotalAmount(checkIn: string, checkOut: string, room: any) {
    // let diff = this.getNoOfDays(checkIn, checkOut);
    let price =
      (room.price.discounted ? (room.price.actual) : room.price.actual) +
      room.price.taxValue;
    // return diff * price;
    return price;

  }
  // (room.price.discounted ? (room.price.actual - room.price.discounted) : room.price.actual) +


  // getTotalAmtWithAddon(){}

  getNoOfDays(checkIn: string, checkOut: string) {
    let startDate = moment(checkIn, 'DD.MM.YYYY');
    let endDate = moment(checkOut, 'DD.MM.YYYY');
    return endDate.diff(startDate, 'days');
  }

  getAgesOfChildrenArray(paxInfo: any[]) {
    let agesArray: number[] = [];
    paxInfo?.forEach((e1: any, index: any) => {
      if (index > 1) {
        agesArray.push(parseInt(e1));
      }
    });
    return agesArray;
  }

  startNewBooking(
    property: any,
    selectedRoom: any,
    searchId: number,
    checkIn: string,
    checkOut: string,
    paxInfo: any,
    addons: any,
    noOfRooms:any
  ) {
    let room: Room = {
      ratePlanId: selectedRoom.ratePlanId,
      roomId: selectedRoom.roomId,
      currency: selectedRoom.currency,
      price: {
        actual: selectedRoom.price.actual,
        discounted: selectedRoom.price.discounted,
        taxValue: selectedRoom.price.taxValue,
      },
    };
    console.log(noOfRooms);
    let bookingItem: BookingItem = {
      property: property,
      addons: [],
      addonTotalPrice: 0,
      searchId: searchId,
      hotelId: property.hotel_id,
      cityId: property.address.cityId,
      checkIn: checkIn,
      checkOut: checkOut,
      noOfRooms: noOfRooms,
      noOfAdults: parseInt(paxInfo?.split('|')[0] ?? 1),
      noOfChildren: parseInt(paxInfo?.split('|')[1] ?? 0),
      paxInfo: paxInfo,
      agesOfChildren: this.getAgesOfChildrenArray(paxInfo?.split('|')),
      rooms: [room],
      noOfDays: this.getNoOfDays(checkIn, checkOut),
      totalAmount: this.getTotalAmount(checkIn, checkOut, selectedRoom),
      renderData: { ...property, rooms: [selectedRoom] },
      payathotel:property.payAtHotel
    };

    this.initializeNewBooking(bookingItem);
  }


  proceedBookingFromOngoingList(index: number) {
    let bookingCart: BookingCart = {
      ...this.bookingCartValue,
      currIndex: index,
    };

    this.bookingCartReflect.set(
      this.bookingCartReflect.HOOKS.BOOKING_CART,
      bookingCart
    );
    this.router.navigate(['/book'], { queryParams: { bookingEngineId: this.BookingConfigService.getBookingEngineId() } });
  }

  removeCurrentBookingItemFromList(i: any) {
    // let index = this.bookingCartValue.currIndex
    let index = i
    if (index != undefined && index != null) {
      let bookingCart = cloneDeep(this.bookingCartValue)
      bookingCart.bookingItems.splice(index, 1)
      bookingCart.currIndex = undefined
      this.bookingCartReflect.set(
        this.bookingCartReflect.HOOKS.BOOKING_CART,
        bookingCart
      );
    }

    // this.router.routeReuseStrategy.shouldReuseRoute = () => true;


  }

  // Update a specific booking item in the cart
  updateBookingItem(updatedItem: BookingItem): void {
    if (!this.bookingCartValue?.bookingItems) return;
    
    const bookingCart = cloneDeep(this.bookingCartValue);
    const index = bookingCart.bookingItems.findIndex(
      (item: BookingItem) => 
        item.hotelId === updatedItem.hotelId && 
        item.searchId === updatedItem.searchId &&
        item.checkIn === updatedItem.checkIn &&
        item.checkOut === updatedItem.checkOut
    );
    
    if (index !== -1) {
      bookingCart.bookingItems[index] = updatedItem;
      this.bookingCartReflect.set(
        this.bookingCartReflect.HOOKS.BOOKING_CART,
        bookingCart
      );
    }
  }

  //
  // Addons
  //

  getAddons(searchParams: any): Observable<any> {
    console.log("getAddons called with params:", searchParams);
    return this.http.get<any>(`${BASE_URL}api/be/getPolicies`, {
      params: searchParams,
      headers: getDefaultHeaders(),
    });
  }

  getDeals(): Observable<any> {
    return this.http.get<any>(`${BASE_URL}api/be/deals`, {
      headers: getDefaultHeaders(),
    });
  }

  validatePromo(promoData: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}api/be/validatePromo`, promoData, {
      headers: getDefaultHeaders()
    });
  }

  addAddon(addon: any) {
    let bookingItem = this.currBookingItemValue;

    if (bookingItem) {
      let addonFound;
      bookingItem.addonTotalPrice = 0
      console.log(bookingItem, "check")

      if (bookingItem.addons) {
        for (let index = 0; index < bookingItem.addons?.length || 0; index++) {
          if (addon['policy_id'] === bookingItem.addons[index]['policy_id']) {
            addonFound = true;
            
            // If qty is 0 or less, remove the addon from cart
            if (!addon.qty || addon.qty <= 0) {
              // Don't remove if it's mandatory
              if (bookingItem.addons[index].mandatory !== true) {
                bookingItem.addons.splice(index, 1);
              }
            } else {
              // Update the quantity and selections of the existing addon
              bookingItem.addons[index].qty = addon.qty;
              bookingItem.addons[index].selectedAdults = addon.selectedAdults;
              bookingItem.addons[index].selectedChildren = addon.selectedChildren;
              bookingItem.addons[index].selectedNights = addon.selectedNights;
            }

            bookingItem.addons.forEach(e => {
              if (bookingItem && e.qty > 0) {
                // Only calculate price for addons with qty > 0
                // Check if it's per booking (flat cost) or per guest (adult/child values)
                if ((e.adultValue === 0 || !e.adultValue) && (e.childValue === 0 || !e.childValue)) {
                  // Per booking - use flat cost
                  const totalCost = parseFloat(String(e.cost || 0)) * e.qty;
                  bookingItem.addonTotalPrice += totalCost;
                } else {
                  // Per guest - use selectedAdults/selectedChildren/selectedNights if available
                  const noOfAdults = e.selectedAdults !== undefined ? e.selectedAdults : (bookingItem.noOfAdults || 0);
                  const noOfChildren = e.selectedChildren !== undefined ? e.selectedChildren : (bookingItem.noOfChildren || 0);
                  const noOfNights = e.selectedNights !== undefined ? e.selectedNights : 1;
                  const adultCost = (e.adultValue || 0) * noOfAdults;
                  const childCost = (e.childValue || 0) * noOfChildren;
                  const totalCost = (adultCost + childCost) * noOfNights * e.qty;
                  bookingItem.addonTotalPrice += totalCost;
                }
              }
            })
            console.log(bookingItem, "hii")
            break;
          }
        }
      }
      if (!addonFound) {
        // Use the qty from the addon parameter, default to 1 if not set
        if (!addon.qty || addon.qty <= 0) {
          addon.qty = 1;
        }
        if (!bookingItem.addons) {
          bookingItem.addons = [];
        }
        bookingItem.addons.push(addon);
        bookingItem.addons.forEach(e => {
          if (bookingItem && e.qty > 0) {
            // Only calculate price for addons with qty > 0
            // Check if it's per booking (flat cost) or per guest (adult/child values)
            if ((e.adultValue === 0 || !e.adultValue) && (e.childValue === 0 || !e.childValue)) {
              // Per booking - use flat cost
              const totalCost = parseFloat(String(e.cost || 0)) * e.qty;
              bookingItem.addonTotalPrice += totalCost;
            } else {
              // Per guest - use selectedAdults/selectedChildren/selectedNights if available
              const noOfAdults = e.selectedAdults !== undefined ? e.selectedAdults : (bookingItem.noOfAdults || 0);
              const noOfChildren = e.selectedChildren !== undefined ? e.selectedChildren : (bookingItem.noOfChildren || 0);
              const noOfNights = e.selectedNights !== undefined ? e.selectedNights : 1;
              const adultCost = (e.adultValue || 0) * noOfAdults;
              const childCost = (e.childValue || 0) * noOfChildren;
              const totalCost = (adultCost + childCost) * noOfNights * e.qty;
              bookingItem.addonTotalPrice += totalCost;
            }
          }
        })
        console.log(bookingItem, "bye")

      }

      let bookingCart = this.bookingCartValue;
      if (this.bookingCartValue.currIndex) {
        bookingCart.bookingItems[this.bookingCartValue.currIndex] = bookingItem;
      }
      this.bookingCartReflect.set(
        this.bookingCartReflect.HOOKS.BOOKING_CART,
        bookingCart
      );
    }
  }

  removeAddon(addon: any) {
    // Prevent removal of mandatory addons
    if (addon.mandatory === true) {
      return;
    }
    
    let bookingItem = this.currBookingItemValue;
    if (bookingItem) {
      bookingItem.addonTotalPrice = 0

      if (bookingItem.addons) {
        for (let index = 0; index < bookingItem?.addons?.length; index++) {
          if (addon['policy_id'] === bookingItem?.addons[index]['policy_id']) {
            // Double check: prevent removal if the addon in cart is also mandatory
            if (bookingItem.addons[index].mandatory === true) {
              return;
            }
            // Remove the addon from cart
            bookingItem?.addons.splice(index, 1);
            
            // Recalculate total price for remaining addons
            bookingItem.addons.forEach(e => {
              if (bookingItem && e.qty > 0) {
                // Only calculate price for addons with qty > 0
                // Check if it's per booking (flat cost) or per guest (adult/child values)
                if ((e.adultValue === 0 || !e.adultValue) && (e.childValue === 0 || !e.childValue)) {
                  // Per booking - use flat cost
                  const totalCost = parseFloat(String(e.cost || 0)) * e.qty;
                  bookingItem.addonTotalPrice += totalCost;
                } else {
                  // Per guest - calculate based on adultValue and childValue
                  const adultCost = (e.adultValue || 0) * (bookingItem.noOfAdults || 0);
                  const childCost = (e.childValue || 0) * (bookingItem.noOfChildren || 0);
                  const totalCost = (adultCost + childCost) * e.qty;
                  bookingItem.addonTotalPrice += totalCost;
                }
              }
            })
            break;
          }
        }
      }

      let bookingCart = this.bookingCartValue;
      if (this.bookingCartValue.currIndex) {
        bookingCart.bookingItems[this.bookingCartValue.currIndex] = bookingItem;
      }
      this.bookingCartReflect.set(
        this.bookingCartReflect.HOOKS.BOOKING_CART,
        bookingCart
      );
    }
  }


  

  getRecommendationsSearchParams() {
    let bookingItem = this.currBookingItemValue;
    let searchParams: any = {
      bookingEngineId: this.BookingConfigService.getBookingEngineId(),
    };

    if (!bookingItem) {
      return searchParams;
    }

    // searchParams.cityId = bookingItem?.renderData?.address?.cityId;
    // searchParams.stateId = bookingItem?.renderData?.address?.stateId;
    // searchParams.countryId = bookingItem?.renderData?.address?.countryId;
    
    // Use checkOut as checkIn for recommendations (start from current booking's checkout date)
    if (bookingItem.checkOut) {
      // Try different date formats
      let checkOutDate;
      if (bookingItem.checkOut.includes('-')) {
        // Format: DD-MM-YYYY or DD/MM/YYYY
        checkOutDate = moment(bookingItem.checkOut, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true);
      } else {
        checkOutDate = moment(bookingItem.checkOut);
      }
      
      if (checkOutDate.isValid()) {
        searchParams.checkIn = checkOutDate.format('DD/MM/YYYY');
        // Add 2 days for checkout
        checkOutDate.add(2, 'days');
        searchParams.checkOut = checkOutDate.format('DD/MM/YYYY');
      } else {
        // Fallback: use checkOut as-is
        searchParams.checkIn = bookingItem.checkOut;
        searchParams.checkOut = bookingItem.checkOut;
      }
    }

    searchParams.paxInfo = bookingItem?.paxInfo || '1|0|0|0||';
    
    // Convert rooms array to JSON string if needed
    if (bookingItem?.rooms && Array.isArray(bookingItem.rooms)) {
      searchParams.rooms = JSON.stringify(bookingItem.rooms);
    } else {
      searchParams.rooms = bookingItem?.rooms || '1';
    }

    return searchParams;
  }

  // PG Loader
  setPGLoaderFlag() {
    let bookingCart: BookingCart = {
      ...this.bookingCartValue,
      loadingPaymentGateway: true
    }
    this.bookingCartReflect.set(
      this.bookingCartReflect.HOOKS.BOOKING_CART,
      bookingCart
    );
    setTimeout(() => {
      this.unsetPGLoaderFlag()
    }, 10000);
  }

  unsetPGLoaderFlag() {
    let bookingCart: BookingCart = {
      ...this.bookingCartValue,
      loadingPaymentGateway: false
    }
    this.bookingCartReflect.set(
      this.bookingCartReflect.HOOKS.BOOKING_CART,
      bookingCart
    );
  }
}
