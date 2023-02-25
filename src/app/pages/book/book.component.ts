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

  addons: any = [];
  eStepper = StepperType;
  stepper: StepperType = this.eStepper.addons;
  activateRouteSubscription$!: Subscription;
  personalDetailsForm!: FormGroup;
  currBookingItem$: Observable<BookingItem | undefined>;
  bookingCart$: Observable<BookingCart>;

  constructor(
    public dialog: MatDialog,
    private bookingService: BookingService,
    private searchService: SearchService,
    private spinner: NgxSpinnerService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {
    this.currBookingItem$ = this.bookingService.currBookingItem$
    this.bookingCart$ = this.bookingService.bookingCart$;
  }

  ngOnInit(): void { }

  openRecommendationsDialog() {
    this.spinner.show();
    this.searchService.getAllHotels().subscribe(res => {
      this.dialog.open(RecommendationsComponent, {
        width: '600px',
        panelClass: ['mat-dialog-custom-dimensions'],
        data: {
          searchResult: res
        },
      });
      this.spinner.hide();
    })
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

  onNext() {

    if (this.stepper === this.eStepper.addons) {

      this.stepper = this.eStepper.personalDetails;
      this.openRecommendationsDialog()

    } else if (this.stepper === this.eStepper.personalDetails) {
      if (this.personalDetailsComponent.personalDetailsForm.valid) {
        this.personalDetailsForm =
          this.personalDetailsComponent.personalDetailsForm;
        // this.stepper = this.eStepper.addons;
        this.paymentService.createOrderAndMakePayment(
          this.bookingService.currBookingItemValue, this.personalDetailsForm.value
        );

      } else {
        this.personalDetailsComponent.personalDetailsForm.markAllAsTouched();
        this.snackBar.open('Please complete the form', '', { duration: 2000 });
      }
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
      history.back();
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
}
