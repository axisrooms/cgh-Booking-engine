import { Component, OnInit } from '@angular/core';
import { HotelBgService } from '../../services/hotel-bg.service';
import { BookingConfigService } from 'src/app/services/bookingid.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  bgUrl: string = '';

  constructor(private hotelBgService: HotelBgService, private bookingConfig: BookingConfigService) { }

  ngOnInit(): void {
    // choose a background image based on bookingEngineId (falls back to default)
    const id = this.bookingConfig.getBookingEngineId();
    const img = this.hotelBgService.getImageForId(id);
    // store relative path; template will set CSS variable using this value
    this.bgUrl = img;
  }


}
