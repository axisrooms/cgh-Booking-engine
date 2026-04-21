import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingConfigService } from 'src/app/services/bookingid.service';
import {
  BASE_URL,
  getDefaultHeaders,
} from '../shared/constants/url.constants';
import { BookingService } from './booking.service';
import { cloneDeep } from 'lodash-es';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    this.createOrder(bookingItem).subscribe((res1) => {
      this.addAddonsToAxisRooms(bookingItem)
        .pipe(
          catchError((error) => {
            console.error('Error while adding addons. Continuing with payment flow.', error);
            return of(null);
          })
        )
        .subscribe(() => {
          this.makePayment(bookingItem, personalDetailsForm,payathotel);
        });
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

  private addAddonsToAxisRooms(bookingItem: any): Observable<any> {
    const activeAddons = (bookingItem?.addons || []).filter((addon: any) => (addon?.qty || 0) > 0);
    if (!activeAddons.length) {
      return of(null);
    }

    const formBody = new URLSearchParams();
    const roomIndex = this.bookingService.bookingCartValue?.currIndex ?? 0;

    formBody.append('searchId', String(bookingItem?.searchId || ''));
    formBody.append('roomNumber', String(roomIndex));
    formBody.append('searchNumber', String(roomIndex + 1));
    formBody.append('promoCode', bookingItem?.promoCode || 'null');

    activeAddons.forEach((addon: any) => {
      const policyId = addon?.policy_id;
      if (!policyId) {
        return;
      }

      const chargeType = this.getAddonChargeType(addon);
      const qty = Number(addon?.qty || 0);
      const adultsCount = Number(addon?.selectedAdults ?? bookingItem?.noOfAdults ?? 1);
      const childrenCount = Number(addon?.selectedChildren ?? bookingItem?.noOfChildren ?? 0);

      formBody.append(
        `policy${policyId}`,
        this.getPolicyValueForChargeType(chargeType, qty, adultsCount, childrenCount)
      );
      formBody.append(
        `policychild${policyId}`,
        this.getPolicyChildValueForChargeType(chargeType, childrenCount)
      );
      formBody.append(`policychargetype${policyId}`, chargeType);

      if (chargeType.toLowerCase() === 'per guest') {
        formBody.append(`policy_gn${policyId}`, String(adultsCount));
        formBody.append(`policy_nn${policyId}`, String(addon?.selectedNights ?? 1));
      }
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    });

    if (this.isLocalDevelopment()) {
      return from(
        fetch(`${BASE_URL}beV2/addAddOnsV3.html`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
          credentials: 'include',
          mode: 'no-cors',
        }).then(() => null)
      );
    }

    return this.http.post(`${BASE_URL}beV2/addAddOnsV3.html`, formBody.toString(), {
      headers,
      responseType: 'text',
      withCredentials: true,
    });
  }

  private isLocalDevelopment(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1';
  }

  private getAddonChargeType(addon: any): string {
    const rawType = (addon?.policy_type_name || addon?.policyChargeType || addon?.type || '').toString().toLowerCase();

    if (rawType.includes('per guest') || rawType.includes('per person')) {
      return 'Per guest';
    }
    if (rawType.includes('per booking')) {
      return 'Per Booking';
    }
    return 'Custom';
  }

  private getPolicyValueForChargeType(
    chargeType: string,
    qty: number,
    adultsCount: number,
    childrenCount: number
  ): string {
    if (chargeType.toLowerCase() === 'per guest') {
      const totalGuests = Math.max(0, adultsCount) + Math.max(0, childrenCount);
      return totalGuests > 0 ? String(totalGuests) : '';
    }

    return qty > 0 ? String(qty) : '';
  }

  private getPolicyChildValueForChargeType(chargeType: string, childrenCount: number): string {
    if (chargeType.toLowerCase() === 'per guest') {
      return String(childrenCount >= 0 ? childrenCount : 0);
    }
    return '';
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

    // Get promo discount from booking item
    const promoDiscount = item.promoDiscount || 0;
    
    const params: Record<string, string> = {
      isBEV3: 'true',
      searchId: item.searchId || '',
      currency: '1',
      promoCodeApplied: promoDiscount > 0 ? promoDiscount.toString() : '',
      promoCode: promoDiscount > 0 ? (item.promoCode || personalDetails.promoCode || '') : '',
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

    const bookingUrl = new URL('beV2/hotelBooking.html', BASE_URL).toString();
    const finalUrl = `${bookingUrl}?${qs}`;
    window.open(finalUrl, '_self');
  }
}
