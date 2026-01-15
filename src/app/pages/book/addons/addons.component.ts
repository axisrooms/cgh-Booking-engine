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
          
          this.addons.forEach((element: { qty: number; count: boolean; mandatory?: boolean; policy_id: any; selectedAdults?: number; selectedChildren?: number; selectedNights?: number; adultValue?: number; childValue?: number }) => {
            // Initialize guest selectors for per-guest addons
            if ((element.adultValue && element.adultValue > 0) || (element.childValue && element.childValue > 0)) {
              element.selectedAdults = element.selectedAdults || this.getNoOfAdults();
              element.selectedChildren = element.selectedChildren || this.getNoOfChildren();
              element.selectedNights = element.selectedNights || 1;
            }
            
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
    
    // Use selected values if available, otherwise use booking values
    const noOfAdults = addon.selectedAdults !== undefined ? addon.selectedAdults : (this.bookingService.currBookingItemValue.noOfAdults || 0);
    const noOfChildren = addon.selectedChildren !== undefined ? addon.selectedChildren : (this.bookingService.currBookingItemValue.noOfChildren || 0);
    
    const adultCost = (addon.adultValue || 0) * noOfAdults;
    const childCost = (addon.childValue || 0) * noOfChildren;
    
    return adultCost + childCost;
  }

  // Calculate total addon price (including quantity)
  calculateTotalAddonPrice(addon: any): number {
    const basePrice = this.calculateAddonPriceWithSelections(addon);
    return basePrice * (addon.qty || 1);
  }

  // Get number of adults from all rooms (using paxInfo or booking cart)
  getNoOfAdults(): number {
    // First try to get from paxInfo in localStorage (contains all rooms info)
    const paxInfo = localStorage.getItem('paxInfo');
    if (paxInfo) {
      const rooms = paxInfo.split('||');
      let totalAdults = 0;
      rooms.forEach(room => {
        if (room) {
          const parts = room.split('|');
          if (parts.length > 0) {
            totalAdults += parseInt(parts[0]) || 0;
          }
        }
      });
      if (totalAdults > 0) {
        return totalAdults;
      }
    }
    
    // Fallback: sum adults from all booking items in cart
    const bookingCart = this.bookingService.bookingCartValue;
    if (bookingCart?.bookingItems && bookingCart.bookingItems.length > 0) {
      let totalAdults = 0;
      bookingCart.bookingItems.forEach(item => {
        totalAdults += item.noOfAdults || 0;
      });
      if (totalAdults > 0) {
        return totalAdults;
      }
    }
    
    // Last fallback: current booking item
    return this.bookingService.currBookingItemValue?.noOfAdults || 1;
  }

  // Get number of children from all rooms (using paxInfo or booking cart)
  getNoOfChildren(): number {
    // First try to get from paxInfo in localStorage (contains all rooms info)
    const paxInfo = localStorage.getItem('paxInfo');
    if (paxInfo) {
      const rooms = paxInfo.split('||');
      let totalChildren = 0;
      rooms.forEach(room => {
        if (room) {
          const parts = room.split('|');
          if (parts.length > 1) {
            totalChildren += parseInt(parts[1]) || 0;
          }
        }
      });
      return totalChildren;
    }
    
    // Fallback: sum children from all booking items in cart
    const bookingCart = this.bookingService.bookingCartValue;
    if (bookingCart?.bookingItems && bookingCart.bookingItems.length > 0) {
      let totalChildren = 0;
      bookingCart.bookingItems.forEach(item => {
        totalChildren += item.noOfChildren || 0;
      });
      return totalChildren;
    }
    
    // Last fallback: current booking item
    return this.bookingService.currBookingItemValue?.noOfChildren || 0;
  }

  // Get adult options for dropdown (1 to max adults)
  getAdultOptions(): number[] {
    const maxAdults = this.getNoOfAdults();
    if (maxAdults <= 0) {
      return [1];
    }
    return Array.from({ length: maxAdults }, (_, i) => i + 1);
  }

  // Get children options for dropdown (0 to max children)
  getChildrenOptions(): number[] {
    const maxChildren = this.getNoOfChildren();
    return Array.from({ length: maxChildren + 1 }, (_, i) => i);
  }

  // Get night options for dropdown (1 to number of nights)
  getNightOptions(): number[] {
    const noOfNights = this.bookingService.currBookingItemValue?.noOfDays || 1;
    return Array.from({ length: noOfNights }, (_, i) => i + 1);
  }

  // Calculate addon price based on user selections
  calculateAddonPriceWithSelections(addon: any): number {
    const selectedAdults = addon.selectedAdults || 0;
    const selectedChildren = addon.selectedChildren || 0;
    const selectedNights = addon.selectedNights || 1;
    
    const adultCost = (addon.adultValue || 0) * selectedAdults;
    const childCost = (addon.childValue || 0) * selectedChildren;
    
    // Apply nights multiplier for per-guest addons
    return (adultCost + childCost) * selectedNights;
  }

  // Update addon price when dropdown selection changes
  updateAddonPrice(addon: any, i: number): void {
    // Update the addon in the booking service
    if (addon.count) {
      this.bookingService.addAddon(addon);
    }
  }

}
