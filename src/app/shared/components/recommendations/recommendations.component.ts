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
       "Recommendations": ["Marari Beach","Spice Coast Cruises","Brunton Boatyard"],
       "images":[
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/05_Coconut Lagoon.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/_MG_7758.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/04_Coconut Lagoon.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/09_Coconut Lagoon.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/75637808 CL.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/115743070 HB.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/176566694 DPV.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/326010376.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2074/384734748.jpg"
    ]
      },
     
      {
       "id": 57739,
       "Property_Name": "Brunton Boatyard",
       "Recommendations": ["Spice Coast Cruises","Marari Beach","Coconut Lagoon","Chittoor Kottaram"],
       "images":[],
      },
      {
       "id": 57737,
       "Property_Name": "Eighth Bastion",
       "Recommendations": ["Spice Coast Cruises","Marari Beach","Coconut Lagoon"],
       "images":[
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/218450552 (1).jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/47335058.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/178970875.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/185013262.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/224468127.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/224804825.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/47335071.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/47349528.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/178970863.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/185013247.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/185013262.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/224468127.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2075/224804825.jpg"
    ]
      },
      {
       "id": 179320,
       "Property_Name": "Chittoor Kottaram",
       "Recommendations": ["Brunton Boatyard","Marari Beach","Coconut Lagoon"],
       "images":[],
      },
      {
       "id": 58748,
       "Property_Name": "Marari Beach",
       "Recommendations": ["Spice Coast Cruises","Coconut Lagoon","Brunton Boatyard"],
       "images": [
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/130504131.jpg",
        "http://resources.axisrooms.s3.amazonaws.com/images/hotels/149/1/marari_beach.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/62311057.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/62385454.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/62389538.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/77903622.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/89626673.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/120960726.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/120960755.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/120960868.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/187416477.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/258305166.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/362850134.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/149/362850218.jpg"
    ]
      },
     
      {
       "id": 53908,
       "Property_Name": "Palais de Mahe",
       "Recommendations": ["Mantra Koodam","Visalam","Maison Perumal"],
       "images":[],
      },
      {
       "id": 53786,
       "Property_Name": "Maison Perumal",
       "Recommendations": ["Mantra Koodam","Visalam","Palais de Mahe"],
       "images":[
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/69950313.jpg",
        "https://lh3.googleusercontent.com/xBQX6dOC8f3JmL2RhqeAg2qUnsCfVEiVn1JfBPseDkF2XsC7YnGTt1bpiwkDzliqp2mjDemXjXY8nKYv6w-EmDdXtMvn7WPskOmnlzDI-UhaYEREiDJIoI8fD8CqQIlCl_ebLn0d_M2wwCyaDH2OGtUi22kOwfjF9EdC5uhsHtXmAhjg0f-tXDtjI4qcKp9iLlNhG56HvOqk3RYxNI5FGkxVkc8eTXI3J3mPKzSTI2JAEb7YXnGv36tXQrnhFw6yPT6INh-AdeJS5vKDeWbXvC_4_SHVQtSRzUP7Z26USfGBAXa7aRp6DBFHj9_BxFIELMIYpJKuPnzIZbovg4i5WUv8P2KDaU0boTQ26BMsXCWGyWJCY0pOoRuSw0JiDconZXFwBYrvFEpEODm8NiZcgxh_dpT6po33zmQmnE-kT1XdbshJVU__qY-dULAezVJxH2smGz7qvQSDNqb8bQgEnxUbg3YDjL38qbz_w73ml2sxxvmTp1_icFneGPRZSfFuw1xDOdCrF0GiOvRmIJza7Kq6wciqe32qAKrsZKRrIFl_gQplep_VJmE0tmyrpY8IbET4rLkCX3evKbtvfcgLbXY1oV6BLa8=w859-h657-no",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/69950123.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/89634826.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/121544699.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/179862718.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/179862760.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/179866283.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/179866303.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/188546505.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/188547488.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2080/233201945.jpg"
    ]
      },
      {
       "id": 53919,
       "Property_Name": "Visalam",
       "Recommendations": ["Mantra Koodam","Spice Village"],
       "images":[
        "http://resources.axisrooms.s3.amazonaws.com/images/hotels/2079/1/xlarge_1318184698.jpg.pagespeed.ic.rZcFBqCFIm.jpg",
        "https://lh3.googleusercontent.com/e0a6EMXYb9BYkS90BmI0EQq5aa0E0UsTi3nBSenXY4DWWGsYW1txqMWZnlcMPG33nLSWLVpaAvaWs5M_-FztNYfa_21XigKLxGfMCU87NInGeZmWB9Gomm04QueLnsMX_GAWtbOWISnCwPnMIQj73qnrAZSAfSnvmoHTc79YNaQCblTEGaeRRQ3hNsy1FS6pT86YzJLmfmniX4vJu54W4SDNCvuAwr40lLyFYUWFO4r9idAaxD_BUypyASSn_ZW_ZSORc9VzUGyj7uZdGFVYaddQ_atzqUxzbCzNRI0UUJU-mj8tsRZJvgfcnQ_4NxWG-ntXfQlfUyE59ocTqV_h_30BYvPV-xaRP4EtkfLg1sexe9OMgN0fZhhfb6dJ1OhtjvP8nJBEudYepyEB7rZRj5n-4rWd-C_6UhjKeGnfemYM2qJjGv9TZMw65Dt-_QN8uP4zlECupVx-vdEZifl43jWjaXsetR3RenhbCJ089wRQinaMCw7ifLtCAsLvrl20uzqtZrvBOWOELpAHvHBcx8joad2JOa6Z6hFY2ce0F5l61Vh9FCbjtmC-9d-hLJCaJiNk-97EFXF8qbTr-L-u8hUameZPYQurQSu8egAwoZIMzlL8=w1199-h799-no"
    ]
      },
      {
       "id": 76059,
       "Property_Name": "Mantra Koodam",
       "Recommendations": ["Palais de Mahe","Maison Perumal","Visalam","Spice Village"],
       "images":[],
      },
      {
       "id": 74280,
       "Property_Name": "Beach Gate Bungalows",
       "Recommendations": ["Spice Coast Cruises","Marari Beach","Coconut Lagoon","Chittoor Kottaram"],
       "images":[
        "http://www.cghearth.com/images/imagetext/large_1418634011.jpg"
    ]
      },
      {
       "id": 67024,
       "Property_Name": "Spice Village",
       "Recommendations": ["Marari Beach","Coconut Lagoon","Spice Coast Cruises","Brunton Boatyard","EIghth Bastion"],
       "images":[
       "http://resources.axisrooms.s3.amazonaws.com/images/hotels/2078/1/spicevillage-pool.jpg",
       "http://resources.axisrooms.s3.amazonaws.com/images/hotels/2078/1/spicevillage-pool.jpg"
   ]
      },
      {
       "id": 74281,
       "Property_Name": "Spice Coast Cruise",
       "Recommendations": ["Marari Beach","Coconut Lagoon","Brunton Boatyard"],
       "images":[
        "http://www.cghearth.com/images/banners/990x320xlarge_1321429896.jpg.pagespeed.ic.TLCZtWSVKf.jpg"],
      
      },
      {
       "id": 58750,
       "Property_Name": "Casino Hotel",
       "Recommendations": ["Marari Beach","Coconut Lagoon","Spice Coast Cruises"],
       "images":[
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/230754807.jpg",
        "",
        "https://lh4.googleusercontent.com/proxy/NH_kYaD-OCkMoBIULMByGJlnttl_dO5v9uTBoQLyoJu5LAdO4faxwTq1GA9Kd5bYexktZzjEv_ns6ADygoN13ckvvJ3jpNDEaoQCnXHfKSzM7pexLAwqo9g0Fb9v5JNVlngYUlIY65gO1-CwXDDDPhrY-9VpSqw=w253-h168-k-no",
        "https://lh5.googleusercontent.com/p/AF1QipMkllS-RoR_V-tP5p8ZDFKSVmQSb_2FeXMhk_iS=w253-h189-k-no",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/36683046.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/44360329.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/47533623.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/47533737.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/47533984.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/47766931.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/47767991.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/47768937.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/230755033.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/230755053.jpg",
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/2073/230755059.jpg"
    ]
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
    location.reload();
  }
  viewRecommendationsForSpecific1(id: any) {
    this.staticresult.Recommendation_List.filter((param)=>{return param.Property_Name === id?param.id:null})
    var id_data = this.staticresult.Recommendation_List.filter((param)=>{return param.Property_Name === id?param.id:null})
    let searchParams: any = this.bookingService.getRecommendationsSearchParams();
    searchParams['productId'] = id_data[0].id;
    this.dialogRef.close()
    this.router.navigate(['/search'], { queryParams: searchParams })
    location.reload();
  }
 
  images(id: any){
    var id_data  = this.staticresult.Recommendation_List.filter((param)=>{return param.Property_Name === id?param.images:null})

    return id_data[0]?.images?id_data[0]?.images:[];
  }
}
