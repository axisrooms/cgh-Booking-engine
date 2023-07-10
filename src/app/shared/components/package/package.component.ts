import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { BookingService } from 'src/app/services/booking.service';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { MatDialog } from '@angular/material/dialog';

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
  lowestRoomPrice: number | undefined;
  addons: any;
  @Input() id_num:number | undefined

  @Input() set property(val) {
    this._property = val
    this.setDeal()
  }

  get property() {
    return this._property
  }

  @Input() searchId!: number;
  @Input() buttonActionType: RoomButtonActionType;
  @Input() index!: number;

  highlightedDeal: any;
  checkIn!: string;
  checkOut!: string;
  cityId!: any;
  stateId!: any;
  countryId!: any;
  searchType!: any;
  productId!: any;
  paxInfo!: any;
  starrate:any = [];
  bookingEngineId = BOOKING_ENGINE_ID;
  activateRouteSubscription$!: Subscription;
  expandTabBlock = false;
  selectedTab!: 'overview' | 'rooms' | 'deals' | 'amenities' | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
       for (let i =1; i <= this.property['star_rating']; i++) {
      this.starrate.push(i);
      localStorage.setItem('policy', JSON.stringify(this.property))
    }
    
  console.log( )
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
      if (e.deal?.title && !deal) {
        deal = e.deal
      }
    });
    this.highlightedDeal = deal


    console.log(this._property, "hiii")

    var arr: number[] = [];
    this._property.rooms.forEach((element: { price: { actual: number; }; }) => {
      arr.push(element.price.actual)
    });

   this.lowestRoomPrice = arr.reduce((a, b) => Math.min(a, b));  // 1
    console.log(this.lowestRoomPrice,arr)

  }

  onExpandTab(selection: 'overview' | 'rooms' | 'deals' | 'amenities') {
    if (this.selectedTab === selection) {
      this.selectedTab = undefined;
      this.expandTabBlock = false;
    } else {
      this.selectedTab = selection;
      this.expandTabBlock = true;
    }
  }

  selectTab(selection: 'overview' | 'rooms' | 'deals' | 'amenities') {
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
        this.paxInfo,
        this.addons,
      );
    } else if (this.buttonActionType === 'ongoingComponent-proceed') {
      this.bookingService.proceedBookingFromOngoingList(this.index)
    }


    console.log(room, "hiii")
  }

  expandImg(img: any) {
    const dialogRef = this.dialog.open(ImagePopupComponent, {
      data: img,
      width: '600px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
