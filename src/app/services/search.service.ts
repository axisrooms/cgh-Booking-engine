import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import {
  BASE_URL,
  BOOKING_ENGINE_ID,
  getDefaultHeaders,
} from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) { }

  private getHotels(params: any): Observable<any> {
    return this.http.get<any>(`${BASE_URL}api/be/search`, {
      params: params,
      headers: getDefaultHeaders(),
    });
  }

  private getRooms(params: any): Observable<any> {
    return this.http.get<any>(`${BASE_URL}api/be/rooms`, {
      params: params,
      headers: getDefaultHeaders(),
    });
  }

  getRoomPrices(params: any) {
    return this.http.get<any>(`${BASE_URL}api/be/finalPrices`, {
      params: params,
      headers: getDefaultHeaders(),
    });
  }



  searchRooms(params: any) {
    return this.getHotels(params).pipe(
      mergeMap((data) => this.getRoomData(data))
    );
  }

  private async getRoomData(data: any) {
    let roomObservables = data['Hotel_Details']?.map((e: any) => {
      let params: any = {};
      params['bookingEngineId'] = BOOKING_ENGINE_ID;
      params['searchId'] = data['search_id'];
      params['productId'] = e.hotel_id;
      return this.getRooms(params).pipe(
        map((roomData) => {
          for (let i = 0; i < data['Hotel_Details']?.length; i++) {
            if (
              roomData['HotelDetails'][0]['hotelId'] ===
              data['Hotel_Details'][i]['hotel_id']
            ) {
              data['Hotel_Details'][i]['rooms'] =
                roomData['HotelDetails'][0]['rooms'];
              break;
            }
          }
        })
      );
    });

    if (roomObservables) {
      await forkJoin(roomObservables).toPromise();
      data['Hotel_Details'] = data['Hotel_Details'].filter(
        (e: any) => e['rooms'] != undefined
      );
    }

    return data;
  }

  getAllHotels(date: any): Observable<any> {
    return this.http.get<any>(`${BASE_URL}api/be/search`, {
      params: { bookingEngineId: BOOKING_ENGINE_ID ,checkin:date,},
      headers: getDefaultHeaders(),
    });
  }
}