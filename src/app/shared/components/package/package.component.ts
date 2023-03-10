import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { BookingService } from 'src/app/services/booking.service';

export type RoomButtonActionType =
  | 'searchComponent-newBooking'
  | 'ongoingComponent-proceed'
  | undefined;

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css'],
})
export class PackageComponent implements OnInit, OnDestroy {
  _property: any;

  @Input() set property(val) {
    this._property = val
    this.setDeal()
  }

  get property() {
    return this._property
  }

  @Input() searchId!: number;
  @Input() buttonActionType: RoomButtonActionType;
  @Input() index!:number;

  highlightedDeal: any;
  checkIn!: string;
  checkOut!: string;
  cityId!: any;
  stateId!: any;
  countryId!: any;
  searchType!: any;
  productId!: any;
  paxInfo!: any;
  bookingEngineId = BOOKING_ENGINE_ID;
  activateRouteSubscription$!: Subscription;
  expandTabBlock = false;
  selectedTab!: 'overview' | 'rooms' | 'deals' | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.activateRouteSubscription$ = this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        this.checkIn = queryParams['checkIn'];
        this.checkOut = queryParams['checkOut'];
        this.cityId = queryParams['cityId'];
        this.stateId = queryParams['stateId'];
        this.countryId = queryParams['countryId'];
        this.searchType = queryParams['searchType'];
        this.productId = queryParams['productId'];
        this.paxInfo = queryParams['paxInfo'];
      }
    ); 
  }

  ngOnDestroy(): void {
    this.activateRouteSubscription$.unsubscribe();
  }

  setDeal() {
    let deal: any
    this._property?.rooms?.forEach((e: any) => {
       if(e.deal?.title && !deal) {
        deal = e.deal
       }
    });
    this.highlightedDeal = deal
  }

  onExpandTab(selection: 'overview' | 'rooms' | 'deals') {
    if (this.selectedTab === selection) {
      this.selectedTab = undefined;
      this.expandTabBlock = false;
    } else {
      this.selectedTab = selection;
      this.expandTabBlock = true;
    }
  }

  selectTab(selection: 'overview' | 'rooms' | 'deals') {
    this.selectedTab = selection;
  }

  roomBtnEvent(property: any, room: any) {
    if (this.buttonActionType === 'searchComponent-newBooking') {
      this.bookingService.startNewBooking(
        property,
        room,
        this.searchId,
        this.checkIn,
        this.checkOut,
        this.paxInfo
      );
    } else if (this.buttonActionType === 'ongoingComponent-proceed') {
      this.bookingService.proceedBookingFromOngoingList(this.index)
    }
  }
}
