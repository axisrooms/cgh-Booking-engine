import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BookingService } from 'src/app/services/booking.service';
import { ImagePopupComponent } from 'src/app/shared/components/image-popup/image-popup.component';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.css'],
})
export class AddonsComponent implements OnInit {
  addons: any = [];
  selectedAddons: any;
  openAddon: boolean | undefined
  num = 0
  totalPrice: number | undefined;
  addonDetail: any;
  config = {
    id: 'custom',
    itemsPerPage: 4,
    currentPage: 1,
  };

  constructor(
    private bookingService: BookingService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.openAddon = false
    this.getAddons()
  }

  add(e: string) {

    if (e == "add") {
      this.num += 1
    } else if (e == "minus") {
      this.num -= 1
      if (this.num <= 0) {
        this.num = 0;
      }
    }

  }

  calAmt(item: any, i: any) {
    // Prevent quantity changes for mandatory addons
    if (item.mandatory === true) {
      return;
    }
    
    // If quantity is 0, remove from cart
    if (item.qty === 0 || item.qty <= 0) {
      item.count = false;
      this.removeAddon(item, i);
    } else {
      // If quantity > 0, add or update in cart
      if (!item.count) {
        item.count = true;
      }
      this.addAddon(item, i);
    }
  }

  getAddons() {

    this.spinner.show();
    if (this.bookingService.currBookingItemValue) {
      this.bookingService
        .getAddons({
          hotelId: this.bookingService.currBookingItemValue['hotelId'],
          searchId: this.bookingService.currBookingItemValue['searchId'],
        })
        .subscribe((res) => {
          this.addons = res['policies'];
          const bookingItem = this.bookingService.currBookingItemValue;
          
          // First, sync existing cart addons with the new addon list
          if (bookingItem && bookingItem.addons) {
            bookingItem.addons.forEach((cartAddon: any) => {
              const addonInList = this.addons.find((a: any) => a.policy_id === cartAddon.policy_id);
              if (addonInList) {
                // If addon exists in list, sync the state
                addonInList.qty = cartAddon.qty || 0;
                addonInList.count = (cartAddon.qty > 0);
              }
            });
          }
          
          this.addons.forEach((element: { qty: number; count: boolean; mandatory?: boolean; policy_id: any }) => {
            // Only auto-add mandatory addons to cart if they're not already there
            if (element.mandatory === true) {
              const inCart = bookingItem?.addons?.find((a: any) => a.policy_id === element.policy_id);
              if (!inCart) {
                element.count = true;
                element.qty = 1;
                this.bookingService.addAddon(element);
              } else {
                // Already in cart, sync the state
                element.count = true;
                element.qty = inCart.qty || 1;
              }
            } else {
              // Non-mandatory addons: check if they're in cart
              const inCart = bookingItem?.addons?.find((a: any) => a.policy_id === element.policy_id);
              if (inCart && inCart.qty > 0) {
                // Already in cart with qty > 0, sync the state
                element.count = true;
                element.qty = inCart.qty;
              } else {
                // Not in cart or qty is 0, set to default
                element.qty = 0;
                element.count = false;
                // Remove from cart if it exists with qty 0
                if (inCart && inCart.qty <= 0) {
                  this.bookingService.removeAddon(element);
                }
              }
            }
          });
          console.log(this.addons)
          this.spinner.hide();
        });
    }
  }

  addAddon(addon: any, i: any) {
    // Set qty to 1 if it's 0 or not set
    if (!addon.qty || addon.qty <= 0) {
      addon.qty = 1;
    }
    
    this.addons.forEach((e: { policy_id: any; count: boolean; }) => {
      if(e.policy_id == addon.policy_id){
        e.count = true
      }
    });
    // this.addons[i].count = true
    this.bookingService.addAddon(addon);
    console.log(this.bookingService, i)
   
  }

  removeAddon(addon: any, i: any) {
    // Prevent removal of mandatory addons
    if (addon.mandatory === true) {
      return;
    }
    
    this.addons.forEach((e: { policy_id: any; count: boolean;qty:any }) => {
      if(e.policy_id == addon.policy_id){
        e.count = false
        e.qty = 0
      }
    });
    // this.addons[i].count = false
    // this.addons[i].qty = 0
    this.bookingService.removeAddon(addon);
  }

  getQty(id: any) {
    let qty = 0;
    for (let index = 0; index < this.selectedAddons.length; index++) {
      if (id === this.selectedAddons[index]['policy_id']) {
        qty = this.selectedAddons[index]['qty'];
        break;
      }
    }
    return qty;
  }


  getDetails(e: any) {
    this.addonDetail = e;
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

  // Calculate addon price based on policy type
  calculateAddonPrice(addon: any): number {
    if (!this.bookingService.currBookingItemValue) {
      return 0;
    }
    
    // If adultValue and childValue are both 0, use the flat cost (per booking)
    if ((addon.adultValue === 0 || !addon.adultValue) && (addon.childValue === 0 || !addon.childValue)) {
      return parseFloat(addon.cost || 0);
    }
    
    // Otherwise calculate based on adults and children (per guest)
    const noOfAdults = this.bookingService.currBookingItemValue.noOfAdults || 0;
    const noOfChildren = this.bookingService.currBookingItemValue.noOfChildren || 0;
    
    const adultCost = (addon.adultValue || 0) * noOfAdults;
    const childCost = (addon.childValue || 0) * noOfChildren;
    
    return adultCost + childCost;
  }

  // Calculate total addon price (including quantity)
  calculateTotalAddonPrice(addon: any): number {
    const basePrice = this.calculateAddonPrice(addon);
    return basePrice * (addon.qty || 1);
  }

  // Get number of adults from current booking
  getNoOfAdults(): number {
    return this.bookingService.currBookingItemValue?.noOfAdults || 0;
  }

  // Get number of children from current booking
  getNoOfChildren(): number {
    return this.bookingService.currBookingItemValue?.noOfChildren || 0;
  }

}
