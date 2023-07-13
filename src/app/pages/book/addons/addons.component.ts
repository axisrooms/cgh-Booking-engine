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
    // if (qty >= 1) {
    //   this.addons[i].cost = this.addons[i].price * qty;
    // }

    // if (e == "add") {
    //   this.num += 1
    // } else if (e == "minus") {
    //   this.num -= 1
    //   if (this.num <= 0) {
    //     this.num = 0;
    //   }
    // }
    // this.totalPrice = price
    // this.totalPrice = price * qty

    this.addAddon(item,i)

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
          this.addons.forEach((element: { qty: number; count: boolean }) => {
            element.qty = 0;
            element.count = false
          });
          console.log(this.addons)
          this.spinner.hide();
        });
    }
  }

  addAddon(addon: any, i: any) {
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

}
