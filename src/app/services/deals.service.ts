import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_URL, getDefaultHeaders } from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class DealsService {
  private dealsSubject = new BehaviorSubject<any>(null);
  readonly deals$: Observable<any> = this.dealsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getDeals(supplierId: number) {
    console.log('getDeals API call - supplierId:', supplierId);
    const url = `${BASE_URL}api/be/productDealsNew?supplierId=${supplierId}`;
    return this.http.get<any>(url, {
      headers: getDefaultHeaders(),
    }).pipe(
      tap(response => {
        console.log('Deals fetched, updating deals$ observable:', response);
        this.dealsSubject.next(response);
      })
    );
  }
}

