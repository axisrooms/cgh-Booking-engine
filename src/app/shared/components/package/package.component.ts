import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { BookingService } from 'src/app/services/booking.service';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { BookingConfigService } from 'src/app/services/bookingid.service';


export type RoomButtonActionType =
  | 'searchComponent-newBooking'
  | 'ongoingComponent-proceed'
  | undefined;

export interface GroupedRoom {
  roomName: string;
  lowestPriceRoom: any;
  otherRatePlans: any[];
  expanded: boolean;
}

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
  @Input() pax:any
   | undefined

  noOfRooms: any;
  filteredImages: string[] = [];
  groupedRooms: GroupedRoom[] = [];

  @Input() set property(val) {
    this._property = val;
    this.setDeal();
    // Filter out empty image strings
    if (val && val.images) {
      this.filteredImages = val.images.filter((img: string) => img && img.trim() !== '');
      // If no valid images, use a placeholder
      if (this.filteredImages.length === 0) {
        this.filteredImages = ['assets/images/no-image-found.png'];
      }
    }
    // Group rooms by name
    this.groupRoomsByName();
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
  bookingEngineId = this.BookingConfigService.getBookingEngineId();
  activateRouteSubscription$!: Subscription;
  expandTabBlock = false;
  selectedTab!: 'overview' | 'rooms' | 'deals' | 'amenities' | undefined;
  adults:any;
  child:any;
  showFullOverview: boolean = false;
  overviewWordLimit: number = 30;
  constructor(
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private dialog:MatDialog,
    private BookingConfigService:BookingConfigService,
  ) { }

  ngOnInit(): void {
       for (let i =1; i <= this.property['star_rating']; i++) {
      this.starrate.push(i);
      localStorage.setItem('policy', JSON.stringify(this.property))
      this.bookingService.count=0;
      this.pax.filter((data:any)=>{this.child = this.child + data.noOfChildren; this.adults = this.adults + data.noOfAdults})
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
        this.noOfRooms = queryParams['rooms']

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

  // Get truncated overview text (first N words)
  getTruncatedOverview(description: string): string {
    if (!description) return '';
    const words = description.split(/\s+/);
    if (words.length <= this.overviewWordLimit) {
      return description;
    }
    return words.slice(0, this.overviewWordLimit).join(' ') + '...';
  }

  // Check if overview needs truncation
  isOverviewLong(description: string): boolean {
    if (!description) return false;
    const words = description.split(/\s+/);
    return words.length > this.overviewWordLimit;
  }

  // Toggle full overview display
  toggleOverview() {
    this.showFullOverview = !this.showFullOverview;
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
        this.noOfRooms
      );
    } else if (this.buttonActionType === 'ongoingComponent-proceed') {
      this.bookingService.proceedBookingFromOngoingList(this.index)
    }


    console.log(room, "hiii")
  }

  expandImg(img: any, images?: string[], index?: number) {
    // If images array is provided, use the new gallery format
    const dialogData = images ? {
      images: images.filter((i: string) => i && i.trim() !== ''),
      currentIndex: index || 0
    } : img;

    const dialogRef = this.dialog.open(ImagePopupComponent, {
      data: dialogData,
      panelClass: 'image-popup-dialog',
      maxWidth: '95vw',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  groupRoomsByName() {
    if (!this._property?.rooms) return;

    const roomMap = new Map<string, any[]>();
    
    // Group rooms by roomName
    this._property.rooms.forEach((room: any) => {
      const roomName = room.roomName || 'Unknown Room';
      if (!roomMap.has(roomName)) {
        roomMap.set(roomName, []);
      }
      roomMap.get(roomName)!.push(room);
    });

    // Create grouped rooms with lowest price first
    this.groupedRooms = [];
    roomMap.forEach((rooms, roomName) => {
      // Sort by price (lowest first)
      rooms.sort((a, b) => a.price.actual - b.price.actual);
      
      this.groupedRooms.push({
        roomName: roomName,
        lowestPriceRoom: rooms[0],
        otherRatePlans: rooms.slice(1),
        expanded: false
      });
    });

    // Sort grouped rooms by lowest price
    this.groupedRooms.sort((a, b) => a.lowestPriceRoom.price.actual - b.lowestPriceRoom.price.actual);
  }

  toggleRatePlans(group: GroupedRoom) {
    group.expanded = !group.expanded;
  }

  isCartFull(): boolean {
    return this.bookingService.isCartFull();
  }
}
