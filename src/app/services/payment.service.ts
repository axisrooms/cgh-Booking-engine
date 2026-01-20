import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingConfigService } from 'src/app/services/bookingid.service';
import {
  BASE_URL,
  BOOKING_ENGINE_ID,
  getDefaultHeaders,
} from '../shared/constants/url.constants';
import { BookingService } from './booking.service';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private http: HttpClient,
    private bookingService: BookingService,
    private BookingConfigService:BookingConfigService,
  ) {}

  async createOrderAndMakePayment(bookingItem: any, personalDetailsForm: any,payathotel: any) {
    console.log(bookingItem,personalDetailsForm,payathotel,"!!!!!")
    this.createOrder(bookingItem).subscribe((res1) => {
      this.makePayment(bookingItem, personalDetailsForm,payathotel);
    });
  }

  createOrder(bookingItem: any) {
    let params = {
      bookingEngineId: this.BookingConfigService.getBookingEngineId(),
      productId: bookingItem.hotelId,
      searchId: bookingItem.searchId,
      checkIn: bookingItem.checkIn,
      checkOut: bookingItem.checkOut,
      cityId: bookingItem.renderData.address.cityId,
      paxInfo: bookingItem.paxInfo,
      selectedrooms: `{"1":{"productId":${bookingItem.hotelId},"roomMap":{"0":{"roomId":${bookingItem.rooms[0].roomId},"ratePlanId":${bookingItem.rooms[0].ratePlanId},"addOnMap":{},"addchildMap":{},"policyChargeScope":{}}}}}`,
    };

    return this.http.get<any>(`${BASE_URL}api/be/rooms`, {
      params: params,
      headers: getDefaultHeaders(),
    });
  }

  makePayment(bookingItem: any, personalDetails: any, payathotel: any) {
    this.bookingService.setPGLoaderFlag();
    const item = cloneDeep(bookingItem);

    // Build address string from address object if available
    let guestAddress = '';
    if (personalDetails.address) {
      const addr = personalDetails.address;
      const parts = [addr.lane, addr.city, addr.state, addr.country].filter(p => p);
      guestAddress = parts.join(', ');
    }

    const params: Record<string, string> = {
      isBEV3: 'true',
      searchId: item.searchId || '',
      currency: '1',
      promoCodeApplied: '',
      promoCode: personalDetails.promoCode || '',
      guestORlogin: 'guestform',
      master_pax_first_name: personalDetails.firstName || '',
      master_pax_last_name: personalDetails.lastName || '',
      contactEmail: personalDetails.emailId || '',
      contactMobile: personalDetails.mobileNo || '',
      guest_address: guestAddress,
      additional_request: personalDetails.specialRequest || '',
      acceptTerms: 'on',
      payAtHotelWithoutCC: payathotel ? 'true' : '',
      cardType: '',
      cardNO: '',
      cardValidity_month: '',
      cardValidity_year: '',
      cardHolderName: '',
      cardValidity_cvv: '',
      AgodacardType: '',
      AgodacardNO: '',
      AgodacardValidity_month: '',
      AgodacardValidity_year: '',
      AgodacardValidity_cvv: '',
      AgodacardHolderName: '',
    };

    const qs = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');

    const finalUrl = `https://app.axisrooms.com/beV2/hotelBooking.html?${qs}`;
    window.open(finalUrl, '_self');
  }
}
