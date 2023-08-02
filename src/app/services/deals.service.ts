import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BASE_URL, getDefaultHeaders } from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class DealsService {
  readonly deals$: Observable<any>;

  constructor(private http: HttpClient) {
    this.deals$ = this.getDeals();
  }

  getDeals() {
    return this.http.get<any>(`https://app.axisrooms.com/api/be/productDealsNew?supplierId=13027`, {
      headers: getDefaultHeaders(),
    });
  }
}

