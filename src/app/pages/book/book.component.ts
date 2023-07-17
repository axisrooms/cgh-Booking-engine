import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';
import { BookingCart, BookingItem } from 'src/app/shared/models/booking.model';
import { RecommendationsComponent } from '../../shared/components/recommendations/recommendations.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { ComponentType } from '@angular/cdk/portal';
// import { Router } from 'express';

export enum StepperType {
  none,
  addons,
  personalDetails,
  payment,
  confirmation,
}

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  @ViewChild(PersonalDetailsComponent)
  personalDetailsComponent!: PersonalDetailsComponent;
  load:boolean =true;
  addons: any = [];
  hotelid:any;
  searchid:any;
  hpolicy:any = false;
  cpolicy:any = false;
  policyresp:any;
  eStepper = StepperType;
  stepper: StepperType = this.eStepper.addons;
  activateRouteSubscription$!: Subscription;
  personalDetailsForm!: FormGroup;
  currBookingItem$: Observable<BookingItem | undefined>;
  bookingCart$: Observable<BookingCart>;
  payathotel:any = false;
  expandTabBlock: boolean =false;
  expandTabBlock1: any =false;
  payflag: any;
  constructor(
    public dialog: MatDialog,
    private bookingService: BookingService,
    private searchService: SearchService,
    private spinner: NgxSpinnerService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.currBookingItem$ = this.bookingService.currBookingItem$
    this.bookingCart$ = this.bookingService.bookingCart$;
  }

  ngOnInit(): void {
    this.currBookingItem$.subscribe(e => {
     this.hotelid = e?.hotelId;
     this.searchid = e?.searchId;
     this.payflag =e?.payathotel;
   
    })
    this.bookingService.getAddons({
      hotelId:   this.hotelid ,
      searchId:  this.searchid,
    })
    .subscribe((res) => {
      this.policyresp = res;
   
    });
}
   
  openRecommendationsDialog() {
    console.log( this.bookingService,'@@@@@')
    this.spinner.show();
    let dat = this.currBookingItem$.subscribe(e => { return e?.checkIn})
    this.searchService.getAllHotels(dat).subscribe(res => {
      this.dialog.open(RecommendationsComponent, {
        width: '600px',
        panelClass: ['mat-dialog-custom-dimensions'],
        data: {
          searchResult: res,
          HotelId:this.hotelid ,
        },
      }).afterClosed().subscribe(res =>{
        if(res.event == true){
        if (this.personalDetailsComponent.personalDetailsForm.valid) {
          this.personalDetailsForm =
            this.personalDetailsComponent.personalDetailsForm;
          // this.stepper = this.eStepper.addons;
          
          this.paymentService.createOrderAndMakePayment(
            this.bookingService.currBookingItemValue, this.personalDetailsForm.value,this.payathotel
          );
        } else {
          this.personalDetailsComponent.personalDetailsForm.markAllAsTouched();
          this.snackBar.open('Please complete the form', '', { duration: 2000 });
        }
      }});
      this.spinner.hide();
    })
  }

  payhotel(){
    if(this.payathotel==true){
      this.payathotel =false;
      this.load = true;
    }else{
      this.payathotel =true;
      this.load = false;
    }
  }

  getAddressString() {
    let str = '';
    if (this.personalDetailsForm.get('address.lane')?.value) {
      str += this.personalDetailsForm.get('address.lane')?.value + ', ';
    }
    if (this.personalDetailsForm.get('address.city')?.value) {
      str += this.personalDetailsForm.get('address.city')?.value + ', ';
    }
    if (this.personalDetailsForm.get('address.state')?.value) {
      str += this.personalDetailsForm.get('address.state')?.value + ', ';
    }
    if (this.personalDetailsForm.get('address.country')?.value) {
      str += this.personalDetailsForm.get('address.country')?.value + ', ';
    }
    return str;
  }
  checkcValue(){
   if(this.cpolicy){
    this.cpolicy = false;
   }else{
    this.cpolicy = true;
   }
 }
 checkhValue(){
  if(this.hpolicy){
    this.hpolicy = false;
   }else{
    this.hpolicy = true;
   }
 }

  onNext() {
console.log(this.stepper, this.eStepper.payment,  this.eStepper.personalDetails)
    if (this.stepper === this.eStepper.addons) {

      this.stepper = this.eStepper.personalDetails;
    

    } else if (this.stepper === this.eStepper.personalDetails && this.hpolicy && this.cpolicy) {
      this.openRecommendationsDialog();
     
    }else{
      this.snackBar.open('Please accept hotel and cancellation policy', '', { duration: 2000 });
    } 



    // if (this.stepper === this.eStepper.personalDetails) {
    //   if (this.personalDetailsComponent.personalDetailsForm.valid) {
    //     this.personalDetailsForm =
    //       this.personalDetailsComponent.personalDetailsForm;
    //     this.stepper = this.eStepper.addons;
    //     this.openRecommendationsDialog()
    //   } else {
    //     this.personalDetailsComponent.personalDetailsForm.markAllAsTouched();
    //     this.snackBar.open('Please complete the form', '', { duration: 2000 });
    //   }
    // } else if (this.stepper === this.eStepper.addons) {
    //   this.paymentService.createOrderAndMakePayment(
    //     this.bookingService.currBookingItemValue, this.personalDetailsForm.value
    //   );
    // }
    window.scrollTo(0, 200);
  }

  goBack() {

    if (this.stepper === this.eStepper.addons) {
      // history.back();
      let searchParams: any = {
        bookingEngineId: BOOKING_ENGINE_ID,
      };
      this.currBookingItem$.subscribe(e => {
        searchParams['productId'] = e?.hotelId;
        searchParams['checkIn'] = e?.checkIn;
        searchParams['checkOut'] = e?.checkOut;
        searchParams['paxInfo'] = e?.paxInfo;
        searchParams['rooms'] = e?.rooms;
        searchParams['searchType'] = 'hotel';
        
      })
      this.router.navigate(['/search'], { queryParams: searchParams })


    } else if (this.stepper === this.eStepper.personalDetails) {
      this.stepper = this.eStepper.addons;
    } else if (this.stepper === this.eStepper.payment) {
      this.stepper = this.eStepper.personalDetails;
    }
    window.scrollTo(0, 0);
  }

  clickFn() {
    this.stepper = this.eStepper.confirmation;
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  policy(data: ComponentType<unknown>){
    const dialogRef = this.dialog.open(data, {

      width: '600px',
      height: '500px'
    });
  }
  
  cancellationpolicy(){
  
      if (this.expandTabBlock) {
        
        this.expandTabBlock = false;
      } else {
        this.expandTabBlock1 = false;
        this.expandTabBlock = true;
      }
  }
  hotelpolicy(){
    if (this.expandTabBlock1) {
      this.expandTabBlock1 = false;
    } else {
      this.expandTabBlock = false;
      this.expandTabBlock1 = true;
    }
  }
}
