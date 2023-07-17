import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private bookingService: BookingService
  ) {}

  async createOrderAndMakePayment(bookingItem: any, personalDetailsForm: any,payathotel: any) {
    console.log(bookingItem,personalDetailsForm,payathotel,"!!!!!")
    this.createOrder(bookingItem).subscribe((res1) => {
      this.makePayment(bookingItem, personalDetailsForm,payathotel);
    });
  }

  createOrder(bookingItem: any) {
    let params = {
      bookingEngineId: BOOKING_ENGINE_ID,
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

  makePayment(bookingItem: any, personalDetails: any,payathotel: any) {
    this.bookingService.setPGLoaderFlag()
    let item = cloneDeep(bookingItem)
    let postpayment =personalDetails.prepayment?bookingItem.totalAmount-personalDetails.prepayment:0;
    // this.bookingService.removeCurrentBookingItemFromList()
    let url1 = `https://app.axisrooms.com/beV2/hotelBooking.html?currency=1&`;
    let url2 = `searchId=${item.searchId}&promoCodeApplied=&promoCode=&`;
    let url3 = `tokenvalues=&master_pax_first_name=${personalDetails.firstName}&master_pax_last_name=${personalDetails.lastName}&`;
    let url4 = `contactEmail=${personalDetails.emailId}&contactMobile=${personalDetails.mobileNo}&`;
    let url5 = `additional_request=${personalDetails.specialRequest}&payAtHotelWithCC=${payathotel}&cardType=4&cardNO=&`;
    let url6 = `cardValidity_month=&cardValidity_year=&cardHolderName=&cardValidity_cvv=&postAmountValue=`+postpayment;
    let finalUrl = url1 + url2 + url3 + url4 + url5 + url6;
    window.open(finalUrl, '_self');
  }
}
