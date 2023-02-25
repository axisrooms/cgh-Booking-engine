import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RecommendationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService,
    private router: Router
  ) { 
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  closeDialog() {
    this.dialogRef.close()
  }

  viewRecommendations() {
    let searchParams: any = this.bookingService.getRecommendationsSearchParams();
    searchParams['searchType'] = 'location';
    this.dialogRef.close()
    this.router.navigate(['/search'], { queryParams: searchParams })
  }


  viewRecommendationsForSpecific(id: any) {
    let searchParams: any = this.bookingService.getRecommendationsSearchParams();
    searchParams['productId'] = id;
    this.dialogRef.close()
    this.router.navigate(['/search'], { queryParams: searchParams })
  }
}
