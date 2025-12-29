import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from 'src/app/services/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
})
export class PersonalDetailsComponent implements OnInit {
  personalDetailsForm!: FormGroup;
  @Input() payathotel: any;
  @Input() bookingItem: any;
  
  promoValidating: boolean = false;
  promoValidated: boolean = false;
  promoError: string = '';
  promoDiscount: number = 0;
  
  // Policy related properties
  cancellationPolicy: string[] = [];
  hotelPolicy: string[] = [];
  policiesLoaded: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.personalDetailsForm = this.getDetailsForm();
    this.loadPolicies();
  }
  
  loadPolicies(): void {
    if (this.bookingItem && this.bookingItem.hotelId && this.bookingItem.searchId) {
      this.bookingService.getAddons({
        hotelId: this.bookingItem.hotelId,
        searchId: this.bookingItem.searchId,
      }).subscribe(
        (res) => {
          console.log('Policy data loaded:', res);
          this.cancellationPolicy = res['cancellationPolicy'] || [];
          this.hotelPolicy = res['hotelPolicy'] || [];
          this.policiesLoaded = true;
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
      
      // Create a simple alert-style dialog
      const dialogContent = `
        <div style="padding: 20px;">
          <h2 style="font-family: 'Adobe Caslon Pro', serif; color: #724e37; margin-bottom: 15px;">Cancellation Policy</h2>
          ${policyHtml}
          <button onclick="this.closest('div').parentElement.remove(); document.body.style.overflow='auto';" 
                  style="margin-top: 20px; padding: 10px 30px; background-color: #2AB59D; color: white; 
                         border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
            Close
          </button>
        </div>
      `;
      
      this.showPolicyDialog(dialogContent);
    } else {
      this.snackBar.open('Cancellation policy not available', 'Close', { duration: 3000 });
    }
  }
  
  viewHotelPolicy(): void {
    if (this.hotelPolicy.length > 0) {
      const policyHtml = '<ul style="text-align: left; padding-left: 20px;">' + 
        this.hotelPolicy.map(policy => `<li style="margin-bottom: 10px;">${policy}</li>`).join('') + 
        '</ul>';
      
      // Create a simple alert-style dialog
      const dialogContent = `
        <div style="padding: 20px;">
          <h2 style="font-family: 'Adobe Caslon Pro', serif; color: #724e37; margin-bottom: 15px;">Hotel Policy</h2>
          ${policyHtml}
          <button onclick="this.closest('div').parentElement.remove(); document.body.style.overflow='auto';" 
                  style="margin-top: 20px; padding: 10px 30px; background-color: #2AB59D; color: white; 
                         border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
            Close
          </button>
        </div>
      `;
      
      this.showPolicyDialog(dialogContent);
    } else {
      this.snackBar.open('Hotel policy not available', 'Close', { duration: 3000 });
    }
  }
  
  private showPolicyDialog(content: string): void {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 8px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    dialog.innerHTML = content;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        document.body.style.overflow = 'auto';
      }
    });
  }

  getDetailsForm() {
    return this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      specialRequest: [''],
      promoCode: [''],
      prepayment: ['', Validators.pattern('^[0-9]*$')],
      address: this.formBuilder.group({
        lane: ['', Validators.required],
        city: ['', Validators.required],
        state: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$'),
          ],
        ],
        country: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$'),
          ],
        ],
        cardno: [''],
        epdate: [''],
        cvv: [''],
      }),
      source: ['mobile/website'],
    });
  }

  get address() {
    return this.personalDetailsForm.controls.address as FormGroup;
  }

  validatePromoCode() {
    const promoCode = this.personalDetailsForm.get('promoCode')?.value;
    
    if (!promoCode || promoCode.trim() === '') {
      this.snackBar.open('Please enter a promo code', 'Close', { duration: 3000 });
      return;
    }

    if (!this.bookingItem) {
      this.snackBar.open('Booking information not available', 'Close', { duration: 3000 });
      return;
    }

    this.promoValidating = true;
    this.promoError = '';
    this.promoValidated = false;

    // Prepare rooms array with roomId and ratePlanId as strings
    const rooms = this.bookingItem.rooms?.map((room: any) => ({
      roomId: room.roomId?.toString(),
      ratePlanId: room.ratePlanId?.toString()
    })) || [];

    // Calculate total price
    const totalPrice = this.bookingItem.rooms?.reduce((sum: number, room: any) => {
      return sum + (room.price?.discounted || room.price?.actual || 0);
    }, 0) || 0;

    const promoData = {
      hotelId: this.bookingItem.hotelId?.toString(),
      checkInDate: this.formatDate(this.bookingItem.checkIn),
      checkOutDate: this.formatDate(this.bookingItem.checkOut),
      promoCode: promoCode.trim(),
      ratePlanID: this.bookingItem.rooms?.[0]?.ratePlanId?.toString(),
      rooms: rooms,
      totalPrice: totalPrice,
      searchId: this.bookingItem.searchId
    };

    console.log('Validating promo code with data:', promoData);
    console.log('Booking Item:', this.bookingItem);

    this.bookingService.validatePromo(promoData).subscribe(
      (response) => {
        console.log('Promo validation response:', response);
        this.promoValidating = false;
        if (response && response.Result && !response.Error) {
          this.promoValidated = true;
          // API returns "Discount Price" inside Result object
          this.promoDiscount = response.Result['Discount Price'] || 0;
          
          // Update the booking item with promo discount
          if (this.bookingItem) {
            this.bookingItem.promoDiscount = this.promoDiscount;
            this.bookingItem.promoCode = promoCode.trim();
            // Trigger cart update by reassigning bookingItem
            this.bookingItem = {...this.bookingItem};
          }
          
          this.snackBar.open(`Promo code applied successfully! Discount: ₹${this.promoDiscount}`, 'Close', { 
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.promoError = response.Error?.ErrorMessage || 'Invalid promo code';
          this.snackBar.open(this.promoError, 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      (error) => {
        console.error('Promo validation error:', error);
        console.error('Error details:', error.error);
        this.promoValidating = false;
        this.promoError = error.error?.Error?.ErrorMessage || 'Failed to validate promo code';
        this.snackBar.open(this.promoError, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  private formatDate(dateString: string): string {
    // Convert from DD.MM.YYYY to DD/MM/YYYY format as per API documentation
    if (dateString && dateString.includes('.')) {
      const parts = dateString.split('.');
      if (parts.length === 3) {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
    }
    // If already in slash format or other format, check and convert
    if (dateString && dateString.includes('-')) {
      // Handle DD-MM-YYYY format
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
    }
    return dateString;
  }

  clearPromoCode() {
    this.personalDetailsForm.get('promoCode')?.setValue('');
    this.promoValidated = false;
    this.promoError = '';
    this.promoDiscount = 0;
    
    // Clear promo discount from booking item
    if (this.bookingItem) {
      this.bookingItem.promoDiscount = 0;
      this.bookingItem.promoCode = undefined;
      // Trigger cart update by reassigning bookingItem
      this.bookingItem = {...this.bookingItem};
    }
  }
}
