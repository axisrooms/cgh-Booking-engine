import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StepperType } from '../book.component';
import { BookingService } from 'src/app/services/booking.service';
import { BookingConfigService } from 'src/app/services/bookingid.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
})
export class StepperComponent implements OnInit {
  eStepper = StepperType;
  @Input() stepper: StepperType = this.eStepper.personalDetails;
  bookingEngineId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private bookingConfigService: BookingConfigService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookingEngineId = params['bookingEngineId'] || '';
    });
  }

  navigateTo(step: string): void {
    const basePath = this.bookingEngineId ? `/book/${step}/${this.bookingEngineId}` : `/book/${step}`;
    this.router.navigate([basePath]);
  }

  navigateToSearch(): void {
    const item = this.bookingService.currBookingItemValue;
    const searchParams: any = {
      bookingEngineId: this.bookingConfigService.getBookingEngineId(),
      productId: item?.hotelId,
      checkIn: item?.checkIn,
      checkOut: item?.checkOut,
      paxInfo: item?.paxInfo,
      rooms: item?.rooms ? item.rooms.length : 1,
      searchType: 'hotel',
    };
    this.router.navigate(['/search'], { queryParams: searchParams });
  }

  isStepClickable(targetStep: StepperType): boolean {
    // Can only click on previous/current steps, not future ones
    return targetStep <= this.stepper;
  }
}
