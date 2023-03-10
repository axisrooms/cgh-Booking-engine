import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.css'],
})
export class AddonsComponent implements OnInit {
  addons: any = [];
  selectedAddons: any;

  constructor(
    private bookingService: BookingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getAddons()
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
          this.spinner.hide();
        });
    }
  }

  addAddon(addon: any) {
    this.bookingService.addAddon(addon);
  }

  removeAddon(addon: any) {
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
}
