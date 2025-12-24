import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DealsService } from 'src/app/services/deals.service';
import { DealDetailsComponent } from './deal-details/deal-details.component';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css'],
})
export class DealsComponent implements OnInit, OnDestroy {
  deals: any;
  activateRouteSubscription$: Subscription;
  index: number | undefined;
  supplierId: number = 0;

  constructor(
    private dealsService: DealsService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private dialog:MatDialog
  ) {
    this.activateRouteSubscription$ = this.activatedRoute.queryParams
      .subscribe((queryParams) => {
        console.log('Query Params:', queryParams);
        this.setIndex(queryParams['index']);
        if (queryParams['supplierId']) {
          this.supplierId = +queryParams['supplierId'];
          console.log('Supplier ID from query params:', this.supplierId);
          this.getDeals();
        }
      });
  }

  ngOnInit(): void {
    // Check if supplierId is already set from route params
    const supplierIdFromRoute = this.activatedRoute.snapshot.queryParams['supplierId'];
    if (supplierIdFromRoute && !this.supplierId) {
      this.supplierId = +supplierIdFromRoute;
      console.log('Supplier ID from snapshot:', this.supplierId);
      this.getDeals();
    }
  }

  setIndex(val: number) {
    this.index = val;
    const element = document.getElementById(`index-${val}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  getDeals() {
    console.log('getDeals called with supplierId:', this.supplierId);
    if (this.supplierId > 0) {
      console.log('Fetching deals for supplierId:', this.supplierId);
      this.dealsService.getDeals(this.supplierId).subscribe((res) => {
        console.log('Deals response:', res);
        this.deals = res;
      }, (error) => {
        console.error('Error fetching deals:', error);
      });
    } else {
      console.warn('Supplier ID is not valid:', this.supplierId);
    }
  }

  ngOnDestroy(): void {
    this.activateRouteSubscription$.unsubscribe();
  }



  openDialog(e: any): void {
    const dialogRef = this.dialog.open(DealDetailsComponent, {
      data: e,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
    });
  }
  }
