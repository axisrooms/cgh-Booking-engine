import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DealsService } from 'src/app/services/deals.service';
import { BookingConfigService } from 'src/app/services/bookingid.service';


@Component({
  selector: 'app-deals-bar',
  templateUrl: './deals-bar.component.html',
  styleUrls: ['./deals-bar.component.css'],
})
export class DealsBar implements OnInit, OnChanges {
  deals$: Observable<any>;
  imagesArray = imagesArray;
  @Input() productId: number = 0;

  constructor(private dealsService: DealsService, private router: Router,private BookingConfigService:BookingConfigService) {
    this.deals$ = this.dealsService.deals$
  }

  ngOnInit(): void {
    this.deals$ = this.dealsService.deals$;
    console.log('DealsBar initialized with productId:', this.productId);
    if (this.productId > 0) {
      this.fetchDeals();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && !changes['productId'].firstChange) {
      console.log('ProductId changed:', changes['productId'].currentValue);
      if (this.productId > 0) {
        this.fetchDeals();
      }
    }
  }

  fetchDeals() {
    console.log('Fetching deals for productId:', this.productId);
    this.dealsService.getDeals(this.productId).subscribe(
      (response) => {
        console.log('Deals fetched successfully:', response);
      },
      (error) => {
        console.error('Error fetching deals:', error);
      }
    );
  }

  goToDeals(index?: number) {
    const queryParams: any = {};
    if (index !== undefined) {
      queryParams.index = index;
    }
    if (this.productId > 0) {
      queryParams.productId = this.productId;
    }
    console.log('Navigating to deals with queryParams:', queryParams);
    this.router.navigate(['/deals?bookingEngineId='+this.BookingConfigService.getBookingEngineId()], { queryParams });
  }
}

const imagesArray = [
  '../../../../assets/temp/images/20170405144824PMSmallcoconut-lagoon-evening-chai-on-a-boat-1.jpg',
  '../../../../assets/temp/images/20170405145238PMSmallKalari-Kovilakom.jpg',
  '../../../../assets/temp/images/20170405145632PMSmallSwaSwara09.jpg',
  '../../../../assets/temp/images/20171019121321PMSmallVisalam.jpg',
  '../../../../assets/temp/images/5_gal_05.jpg',
];
