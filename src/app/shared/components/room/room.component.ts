import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { SearchService } from 'src/app/services/search.service';
import { BOOKING_ENGINE_ID } from '../../constants/url.constants';
import { ImagePopupComponent } from '../image-popup/image-popup.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  @Input() room: any;
  @Input() id: number | any;
  @Input() property: any;
  @Output() btnEvent = new EventEmitter<any>();
  bookingCart$: any;
  @Input() checkIn:any
  @Input() checkOut:any
  @Input() productId:any
  @Input() paxInfo:any
  flag = false;
  isdisbled = false;
data:any;
  constructor(
    private searchService: SearchService,
    private dialog: MatDialog,
    private bookingService: BookingService,
  ) { 
    this.bookingCart$ = this.bookingService.currBookingItem$
  }

  ngOnInit(): void {
    console.log(this.room, this.property)
    localStorage.removeItem('reflectStore');
    // this.getPrices()

  }


  getPrices(){
    let params: any = {};
    params['bookingEngineId'] = BOOKING_ENGINE_ID;
    params['productId'] =this.productId;
    params['paxInfo'] =this.paxInfo;
    params['isDorm'] =false;
    params['checkIn'] =this.checkIn;
    params['checkOut'] =this.checkOut;

    this.searchService.getRoomPrices(params).subscribe(res=>{

    })

  }

  onBookNow() {
    this.data =  localStorage.getItem('reflectStore')?localStorage.getItem('reflectStore'):"NA";
   
    this.data =JSON.parse(this.data);
 
    

      
    if(this.flag){
      if(this.data["BOOKING_CART"]["bookingItems"])){
      if(confirm("You are not allowed to add one more Room.")){     
         this.bookingService.cartflag = true;
         this.btnEvent.emit('button clicked');
         this.flag = true;
      }}else{
         this.bookingService.cartflag = true;
         this.btnEvent.emit('button clicked');
        this.flag = true;
      }

    }else{
     
   
     this.bookingService.cartflag = true;
    this.btnEvent.emit('button clicked');
      this.flag = true;
    }
    
  
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
