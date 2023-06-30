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
  ids=[58748,57739,54027,76022,74280,74281,53919,179320,53786,179319,76059,57737,67024,53908,171549,58750];
  staticresult = {
    "Recommendation_List":[
      {
       "id": 54027,
       "Property_Name": "Coconut Lagoon",
       "Recommendations": ["Marari Beach","Spice Coast Cruises","Brunton Boatyard"]
      },
     
      {
       "id": 57739,
       "Property_Name": "Brunton Boatyard",
       "Recommendations": ["Spice Coast Cruises","Marari Beach","Coconut Lagoon","Chittoor Kottaram"]
      },
      {
       "id": 57737,
       "Property_Name": "Eighth Bastion",
       "Recommendations": ["Spice Coast Cruises","Marari Beach","Coconut Lagoon"]
      },
      {
       "id": 179320,
       "Property_Name": "Chittoor Kottaram",
       "Recommendations": ["Brunton Boatyard","Marari Beach","Coconut Lagoon"]
      },
      {
       "id": 58748,
       "Property_Name": "Marari Beach",
       "Recommendations": ["Spice Coast Cruises","Coconut Lagoon","Brunton Boatyard"]
      },
     
      {
       "id": 53908,
       "Property_Name": "Palais de Mahe",
       "Recommendations": ["Mantra Koodam","Visalam","Maison Perumal"]
      },
      {
       "id": 53786,
       "Property_Name": "Maison Perumal",
       "Recommendations": ["Mantra Koodam","Visalam","Palais de Mahe"]
      },
      {
       "id": 53919,
       "Property_Name": "Visalam",
       "Recommendations": ["Mantra Koodam","Spice Village"]
      },
      {
       "id": 76059,
       "Property_Name": "Mantra Koodam",
       "Recommendations": ["Palais de Mahe","Maison Perumal","Visalam","Spice Village"]
      },
      {
       "id": 74280,
       "Property_Name": "Beach Gate Bungalows",
       "Recommendations": ["Spice Coast Cruises","Marari Beach","Coconut Lagoon","Chittoor Kottaram"]
      },
      {
       "id": 67024,
       "Property_Name": "Spice Village",
       "Recommendations": ["Marari Beach","Coconut Lagoon","Spice Coast Cruises","Brunton Boatyard","EIghth Bastion"]
      },
      {
       "id": 74281,
       "Property_Name": "Spice Coast Cruise",
       "Recommendations": ["Marari Beach","Coconut Lagoon","Brunton Boatyard"]
      
      },
      {
       "id": 58750,
       "Property_Name": "Casino Hotel",
       "Recommendations": ["Marari Beach","Coconut Lagoon","Spice Coast Cruises"]
      }
     ],
  }
  constructor(
    public dialogRef: MatDialogRef<RecommendationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService,
    private router: Router
  ) { 
  }

  ngOnInit(): void {
    console.log(this.data.HotelId)
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
  viewRecommendationsForSpecific1(id: any) {
    this.staticresult.Recommendation_List.filter((param)=>{return param.Property_Name === id?param.id:null})
    var id_data = this.staticresult.Recommendation_List.filter((param)=>{return param.Property_Name === id?param.id:null})
    let searchParams: any = this.bookingService.getRecommendationsSearchParams();
    searchParams['productId'] = id_data[0].id;
    this.dialogRef.close()
    this.router.navigate(['/search'], { queryParams: searchParams })
  }
}
