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
  productId: number = 0;

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
        if (queryParams['productId']) {
          this.productId = +queryParams['productId'];
          console.log('Product ID from query params:', this.productId);
          this.getDeals();
        }
      });
  }

  ngOnInit(): void {
    // Check if productId is already set from route params
    const productIdFromRoute = this.activatedRoute.snapshot.queryParams['productId'];
    if (productIdFromRoute && !this.productId) {
      this.productId = +productIdFromRoute;
      console.log('Product ID from snapshot:', this.productId);
      this.getDeals();
    }
  }

  setIndex(val: number) {
    this.index = val;
    const element = document.getElementById(`index-${val}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  getDeals() {
    console.log('getDeals called with productId:', this.productId);
    if (this.productId > 0) {
      console.log('Fetching deals for productId:', this.productId);
      this.dealsService.getDeals(this.productId).subscribe((res) => {
        console.log('Deals response:', res);
        this.deals = res;
      }, (error) => {
        console.error('Error fetching deals:', error);
      });
    } else {
      console.warn('Product ID is not valid:', this.productId);
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
