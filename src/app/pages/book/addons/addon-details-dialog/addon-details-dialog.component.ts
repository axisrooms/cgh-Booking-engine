import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { ImagePopupComponent } from 'src/app/shared/components/image-popup/image-popup.component';

@Component({
  selector: 'app-addon-details-dialog',
  templateUrl: './addon-details-dialog.component.html',
  styleUrls: ['./addon-details-dialog.component.css']
})
export class AddonDetailsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddonDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public addonDetail: any,
    private bookingService: BookingService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  expandImg(img: any): void {
    const dialogRef = this.dialog.open(ImagePopupComponent, {
      data: img,
      width: '600px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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

  // Calculate addon price based on policy type
  calculateAddonPrice(addon: any): number {
    if (!this.bookingService.currBookingItemValue) {
      return 0;
    }
    
    // If adultValue and childValue are both 0, use the flat cost (per booking)
    if ((addon.adultValue === 0 || !addon.adultValue) && (addon.childValue === 0 || !addon.childValue)) {
      return parseFloat(addon.cost || 0);
    }
    
    const noOfAdults = this.getNoOfAdults();
    const noOfChildren = this.getNoOfChildren();
    
    const adultCost = (addon.adultValue || 0) * noOfAdults;
    const childCost = (addon.childValue || 0) * noOfChildren;
    
    return adultCost + childCost;
  }
}
