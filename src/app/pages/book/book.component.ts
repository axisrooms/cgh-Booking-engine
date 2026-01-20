import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';
import { BookingCart, BookingItem } from 'src/app/shared/models/booking.model';
import { RecommendationsComponent } from '../../shared/components/recommendations/recommendations.component';
import { TermsDialogComponent } from '../../shared/components/terms-dialog/terms-dialog.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from 'src/app/services/search.service';
import { BookingConfigService } from 'src/app/services/bookingid.service';
import { Router } from '@angular/router';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { ComponentType } from '@angular/cdk/portal';
import { json } from 'express';
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
  load: boolean = true;
  addons: any = [];
  hotelid: any;
  searchid: any;
  hpolicy: any = false;
  cpolicy: any = false;
  policyresp: any;
  eStepper = StepperType;
  stepper: StepperType = this.eStepper.addons;
  activateRouteSubscription$!: Subscription;
  personalDetailsForm!: FormGroup;
  currBookingItem$: Observable<BookingItem | undefined>;
  bookingCart$: Observable<BookingCart>;
  payathotel: any = false;
  expandTabBlock: boolean = false;
  expandTabBlock1: any = false;
  payflag: any;
  isPayAtHotelAvailable: boolean = false;
  cardDetails: any = {
    cardno: '',
    epdate: '',
    cvv: ''
  };
  // Policy related properties
  cancellationPolicy: string[] = [];
  hotelPolicy: string[] = [];
  policiesLoaded: boolean = false;
  acceptTerms: boolean = false;
  constructor(
    public dialog: MatDialog,
    private bookingService: BookingService,
    private searchService: SearchService,
    private spinner: NgxSpinnerService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private BookingConfigService: BookingConfigService
  ) {
    this.currBookingItem$ = this.bookingService.currBookingItem$
    this.bookingCart$ = this.bookingService.bookingCart$;
  }

  ngOnInit(): void {
    this.currBookingItem$.subscribe(e => {
      this.hotelid = e?.hotelId;
      this.searchid = e?.searchId;
      this.payflag = e?.payathotel;

      // Check if Pay At Hotel option is available from the hotel data
      this.isPayAtHotelAvailable = e?.payathotel === true;

      // Load policies when booking item is available
      if (this.hotelid && this.searchid) {
        this.loadPolicies();
      }
    });

    // Set default stepper to addons - the addons component will handle fetching
    this.stepper = this.eStepper.addons;
  }

  loadPolicies(): void {
    if (this.hotelid && this.searchid) {
      this.bookingService.getAddons({
        hotelId: this.hotelid,
        searchId: this.searchid,
      }).subscribe(
        (res) => {
          console.log('Policy data loaded:', res);
          this.cancellationPolicy = res['cancellationPolicy'] || [];
          this.hotelPolicy = res['hotelPolicy'] || [];
          this.policiesLoaded = true;
          this.policyresp = res;
        },
        (error) => {
          console.error('Error loading policies:', error);
          this.snackBar.open('Failed to load policies', 'Close', { duration: 3000 });
        }
      );
    }
  }

  viewCancellationPolicy(): void {
    if (this.cancellationPolicy.length > 0) {
      const policyHtml = '<ul style="text-align: left; padding-left: 20px;">' +
        this.cancellationPolicy.map(policy => `<li style="margin-bottom: 10px;">${policy}</li>`).join('') +
        '</ul>';

      this.showPolicyDialog('Cancellation Policy', policyHtml);
    } else {
      this.snackBar.open('Cancellation policy not available', 'Close', { duration: 3000 });
    }
  }

  viewHotelPolicy(): void {
    if (this.hotelPolicy.length > 0) {
      const policyHtml = '<ul style="text-align: left; padding-left: 20px;">' +
        this.hotelPolicy.map(policy => `<li style="margin-bottom: 10px;">${policy}</li>`).join('') +
        '</ul>';

      this.showPolicyDialog('Hotel Policy', policyHtml);
    } else {
      this.snackBar.open('Hotel policy not available', 'Close', { duration: 3000 });
    }
  }

  private showPolicyDialog(title: string, content: string): void {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background-color: rgba(0,0,0,0.5); z-index: 9999; 
      display: flex; align-items: center; justify-content: center;
    `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white; border-radius: 8px; max-width: 600px; 
      max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 20px;
    `;

    dialog.innerHTML = `
      <h2 style="font-family: 'Adobe Caslon Pro', serif; color: #724e37; margin-bottom: 15px; margin-top: 0;">
        ${title}
      </h2>
      ${content}
      <button class="close-policy-btn" 
              style="margin-top: 20px; padding: 10px 30px; background-color: #2AB59D; color: white; 
                     border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
        Close
      </button>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close button handler
    const closeBtn = dialog.querySelector('.close-policy-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.removeChild(overlay);
        document.body.style.overflow = 'auto';
      });
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        e.preventDefault();
        e.stopPropagation();
        document.body.removeChild(overlay);
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Recommendations popup disabled - not required
  // openRecommendationsDialog() {
  //   this.spinner.show();
  //   const checkIn = this.bookingService.currBookingItemValue?.checkIn;
  //   this.searchService.getAllHotels(checkIn).subscribe(res => {
  //     this.dialog.open(RecommendationsComponent, {
  //       width: '600px',
  //       panelClass: ['mat-dialog-custom-dimensions'],
  //       position: { bottom: '0px' },
  //       data: {
  //         searchResult: res,
  //         HotelId: this.hotelid,
  //       },
  //     }).afterClosed().subscribe(res => {
  //       if (res && res.event == true) {
  //         if (this.personalDetailsComponent.personalDetailsForm.valid) {
  //           this.personalDetailsForm =
  //             this.personalDetailsComponent.personalDetailsForm;
  //           if (this.payathotel) {
  //             this.paymentService.createOrder(this.bookingService.currBookingItemValue).subscribe(
  //               (res1) => {
  //                 this.clickFn();
  //               },
  //               (error) => {
  //                 console.error('Error creating order:', error);
  //                 this.snackBar.open('Error creating order. Please try again.', '', { duration: 3000 });
  //               }
  //             );
  //           } else {
  //             try {
  //               this.paymentService.createOrderAndMakePayment(
  //                 this.bookingService.currBookingItemValue, this.personalDetailsForm.value, this.payathotel
  //               );
  //             } catch (error) {
  //               console.error('Error processing payment:', error);
  //               this.snackBar.open('Error processing payment. Please try again.', '', { duration: 3000 });
  //             }
  //           }
  //         } else {
  //           this.personalDetailsComponent.personalDetailsForm.markAllAsTouched();
  //           this.snackBar.open('Please complete the form', '', { duration: 2000 });
  //         }
  //       }
  //     });
  //     this.spinner.hide();
  //   })
  // }

  setPayNow() {
    this.payathotel = false;
    this.load = true;
    this.acceptTerms = false;
    // Card details will be shown for Pay Now option
  }

  setPayAtHotel() {
    this.payathotel = true;
    this.load = false;
    this.acceptTerms = false;
    // Clear card details when switching to Pay at Hotel
    this.cardDetails = {
      cardno: '',
      epdate: '',
      cvv: ''
    };
  }

  // Format card number with spaces every 4 digits
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    this.cardDetails.cardno = formattedValue;
    event.target.value = formattedValue;
  }

  // Format expiry date with slash
  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\//g, '').replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    this.cardDetails.epdate = value;
    event.target.value = value;
  }

  payhotel() {
    if (this.payathotel == true) {
      this.payathotel = false;
      this.load = true;
    } else {
      this.payathotel = true;
      this.load = false;
    }
  }

  openTermsDialog(): void {
    this.dialog.open(TermsDialogComponent, {
      width: '650px',
      maxHeight: '90vh',
      panelClass: 'terms-dialog',
      autoFocus: false
    });
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
  checkcValue() {
    if (this.cpolicy) {
      this.cpolicy = false;
    } else {
      this.cpolicy = true;
    }
  }
  checkhValue() {
    if (this.hpolicy) {
      this.hpolicy = false;
    } else {
      this.hpolicy = true;
    }
  }

  onNext() {
    console.log(this.stepper, this.eStepper.payment, this.eStepper.personalDetails)
    if (this.stepper === this.eStepper.addons) {
      // If there are no addons, skip to personalDetails
      if (!this.policyresp?.addons || this.policyresp.addons.length === 0) {
        this.stepper = this.eStepper.personalDetails;
      } else {
        // If addons exist, stay on addons and let user proceed manually
        this.stepper = this.eStepper.personalDetails;
      }
    } else if (this.stepper === this.eStepper.personalDetails) {
      // Check if personalDetailsComponent is initialized
      if (!this.personalDetailsComponent || !this.personalDetailsComponent.personalDetailsForm) {
        this.snackBar.open('Form is not ready. Please try again.', '', { duration: 2000 });
        return;
      }

      // Check if terms and conditions are accepted
      if (!this.acceptTerms) {
        this.snackBar.open('Please accept the Terms and Conditions to proceed', '', { duration: 3000 });
        return;
      }

      // Check if both policy checkboxes are checked
      if (!this.cpolicy) {
        this.snackBar.open('Please read and acknowledge the Cancellation Policy', '', { duration: 3000 });
        return;
      }

      if (!this.hpolicy) {
        this.snackBar.open('Please read and acknowledge the Hotel Policy', '', { duration: 3000 });
        return;
      }

      // Validate the form
      if (this.personalDetailsComponent.personalDetailsForm.valid) {
        this.personalDetailsForm = this.personalDetailsComponent.personalDetailsForm;

        // Add card details to the form if Pay Now is selected
        if (!this.payathotel && this.cardDetails) {
          this.personalDetailsForm.get('address.cardno')?.setValue(this.cardDetails.cardno);
          this.personalDetailsForm.get('address.epdate')?.setValue(this.cardDetails.epdate);
          this.personalDetailsForm.get('address.cvv')?.setValue(this.cardDetails.cvv);
        }

        // Check if currBookingItemValue exists
        if (!this.bookingService.currBookingItemValue) {
          this.snackBar.open('Booking information is missing. Please try again.', '', { duration: 2000 });
          return;
        }

        // Proceed with payment directly (recommendations popup disabled)
        if (this.payathotel) {
          // Pay at Hotel - still need to call makePayment with payathotel=true
          this.paymentService.createOrderAndMakePayment(
            this.bookingService.currBookingItemValue, this.personalDetailsForm.value, this.payathotel
          );
        } else {
          try {
            this.paymentService.createOrderAndMakePayment(
              this.bookingService.currBookingItemValue, this.personalDetailsForm.value, this.payathotel
            );
          } catch (error) {
            console.error('Error processing payment:', error);
            this.snackBar.open('Error processing payment. Please try again.', '', { duration: 3000 });
          }
        }
      } else {
        this.personalDetailsComponent.personalDetailsForm.markAllAsTouched();
        this.snackBar.open('Please complete the form', '', { duration: 2000 });
      }
    }




    window.scrollTo(0, 200);
  }

  goBack() {

    if (this.stepper === this.eStepper.addons) {
      // history.back();
      let searchParams: any = {
        bookingEngineId: this.BookingConfigService.getBookingEngineId(),
      };
      this.currBookingItem$.subscribe(e => {
        console.log(e)
        searchParams['productId'] = e?.hotelId;
        searchParams['checkIn'] = e?.checkIn;
        searchParams['checkOut'] = e?.checkOut;
        searchParams['paxInfo'] = e?.paxInfo;
        searchParams['rooms'] = JSON.stringify(e?.rooms);
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
  policy(data: ComponentType<unknown>) {
    const dialogRef = this.dialog.open(data, {

      width: '600px',
      height: '500px'
    });
  }

  cancellationpolicy() {
    if (this.expandTabBlock) {
      this.expandTabBlock = false;
    } else {
      this.expandTabBlock1 = false;
      this.expandTabBlock = true;
    }
  }

  hotelpolicy() {
    if (this.expandTabBlock1) {
      this.expandTabBlock1 = false;
    } else {
      this.expandTabBlock = false;
      this.expandTabBlock1 = true;
    }
  }
}
