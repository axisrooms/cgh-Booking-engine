import { HttpHeaders } from "@angular/common/http";


export const BASE_URL = 'https://be.axisrooms.com/'
//export const BASE_URL = 'https://app.axisrooms.com/'

export const BOOKING_ENGINE_ID = 3529;


// export const BASE_URL = 'https://sandbox3.axisrooms.com/'
// export const BOOKING_ENGINE_ID = 27;

export const endpoints = {
  user_info: BASE_URL + "/api/user/",
}

export function getDefaultHeaders() {
  return new HttpHeaders({
    apiKey: '132706a3eae0a6d542ed7927de43589c12485fa7',
    channelId: '0',
  });
}
