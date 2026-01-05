import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { Router } from '@angular/router';
import { BookingConfigService } from 'src/app/services/bookingid.service';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {
  recommendations: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<RecommendationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService,
    private router: Router,
    private BookingConfigService: BookingConfigService
  ) {
  }

  ngOnInit(): void {
    console.log('Recommendations HotelId:', this.data.HotelId);
    // Ensure HotelId is a number for comparison
    if (this.data && this.data.HotelId) {
      this.data.HotelId = Number(this.data.HotelId);
    }

    if (this.data?.searchResult?.Hotel_Details) {
      this.recommendations = this.data.searchResult.Hotel_Details.filter(
        (hotel: any) => hotel.hotel_id != this.data.HotelId
      );
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: true })
  }

  viewRecommendations() {
    let searchParams: any = this.bookingService.getRecommendationsSearchParams();
    searchParams['searchType'] = 'location';
    this.dialogRef.close({ event: false })
    this.router.navigate(['/search'], {
      queryParams: {
        ...searchParams,
        bookingEngineId: this.BookingConfigService.getBookingEngineId()
      }
    });
  }


  viewRecommendationsForSpecific(id: any) {
    let searchParams: any = this.bookingService.getRecommendationsSearchParams();
    searchParams['productId'] = id;
    searchParams['rooms'] = 1;
    searchParams['paxInfo'] = '1|0|0|0||';
    this.dialogRef.close({ event: false })
    this.router.navigate(['/search'], {
      queryParams: {
        ...searchParams,
        bookingEngineId: this.BookingConfigService.getBookingEngineId()
      }
    });
  }

  getImage(hotel: any): string {
    if (hotel.images && hotel.images.length > 0) {
      // Find the first non-empty image
      const img = hotel.images.find((i: string) => i && i.trim() !== '');
      if (img) return img;
    }
    return '../../../../assets/images/no-image-found.png';
  }
}

