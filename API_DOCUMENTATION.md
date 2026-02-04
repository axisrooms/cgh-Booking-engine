# CGH Booking Engine

## Aggregator Booking Engine API Documentation V.1.0

**CGH Booking Engine - Aggregator Booking Engine - API Documentation**  
**Version:** 1.0  
**Date:** 02 Feb 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Search](#2-search)
3. [Rooms](#3-rooms)
4. [Deals](#4-deals)
5. [Promos](#5-promos)
6. [Validate Promo](#6-validate-promo)
7. [Policies / Addons](#7-policies--addons)
8. [Final Prices](#8-final-prices)
9. [Booking / Payment](#9-booking--payment)
10. [Location](#10-location)

---

## 1. Introduction

This documentation is for the CGH Booking Engine API, to describe the endpoints, usage and the functionality. All the endpoints are JSON based Requests/Responses.

For each integration, unique API Credentials (`apiKey` and `channelId`) are provided which should be included in the **HEADER** and a unique Booking Engine ID (`bookingEngineId`) will be provided which should be passed as a value as shown in the below examples. These are applicable for both GET or POST methods.

For each endpoint there are few **Mandatory** and **Optional** Parameters, which are mentioned for each endpoint below. Optional params are passed to filter the results further and ease of access to the specific information.

### Base Configuration

| Configuration | Value |
|---------------|-------|
| **Base URL** | `https://preprod2.axisrooms.com/` |
| **Booking Engine ID** | `4529` |

### Default Headers

All API requests require the following headers:

```json
{
  "apiKey": "132706a3eae0a6d542ed7927de43589c12485fa7",
  "channelId": "0",
  "Content-Type": "application/json"
}
```

> **Note:** Date Format across the endpoints is **DD/MM/YYYY**

---

## 2. Search

Search endpoint is used to fetch all the hotels and their content and pricing information.

**Method:** `GET`

**Params (mandatory):** `bookingEngineId`

**Mandatory URL:**
```
https://preprod2.axisrooms.com/api/be/search?bookingEngineId=4529
```

**Optional URL:**
```
https://preprod2.axisrooms.com/api/be/search?bookingEngineId=4529&checkIn=03/11/2024&checkOut=04/11/2024&paxInfo=2|0&productId=12345&cityId=1&stateId=1&countryId=1
```

### Request Parameters

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `bookingEngineId` | String | **Y** | This is a unique AxisRooms booking engine ID which will be provided by AxisRooms |
| `checkIn` | String | Optional | Check in date for a room type search (DD/MM/YYYY) |
| `checkOut` | String | Optional | Check out date for a room type (DD/MM/YYYY) |
| `productId` | String | Optional | Hotel/Property ID to search specific hotel |
| `dealId` | String | Optional | Deal ID which is set for the property |
| `promoId` | String | Optional | Promo code set for the property |
| `countryId` | String | Optional | Country ID provided by AxisRooms |
| `stateId` | String | Optional | State ID provided by AxisRooms |
| `cityId` | String | Optional | City ID provided by AxisRooms |
| `paxInfo` | String | Optional | Format: `adults\|children\|childAge1\|childAge2...` For multiple rooms: `adults\|children\|ages\|\|adults\|children\|ages` |
| `rooms` | int | Optional | Number of rooms required |

### Sample Response

```json
{
  "search_id": 31598950,
  "Hotel_Details": [
    {
      "hotel_id": 72397,
      "hotel_name": "CGH Earth Hotel",
      "description": "Luxury Resort with Nature Experience",
      "coordinates": {
        "latitude": "9.4981",
        "longitude": "76.3388"
      },
      "address": {
        "cityId": "7425",
        "city": "Kumarakom",
        "stateId": "883",
        "state": "Kerala",
        "countryId": "1",
        "country": "India",
        "address_Line": "Kavanattinkara, Kumarakom"
      },
      "property_type": "Luxury Resort",
      "amenities": [
        "Safe",
        "Complimentary Toiletries",
        "Wi-Fi (Complimentary)",
        "Swimming Pool",
        "Spa"
      ],
      "images": [
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/66776/resort-image.jpg"
      ],
      "deal": {
        "id": 0,
        "value": 0,
        "applicable": false
      },
      "price": {
        "actual": 10000,
        "discounted": 9500,
        "tax": 1710
      },
      "inventory": 5,
      "goodToKnow": [],
      "commute": [],
      "isWholeSaler": false,
      "preferedPosition": 0,
      "taxes": [
        {
          "value": 18,
          "name": "GST",
          "type": "Percentage"
        }
      ],
      "currency": "INR"
    }
  ]
}
```

---

## 3. Rooms

Rooms endpoint is used to fetch all the Room types and their Rate / Meal plan information for a specific hotel.

**Method:** `GET`

**Params (mandatory):** `bookingEngineId`, `searchId`, `productId`

**Basic URL:**
```
https://preprod2.axisrooms.com/api/be/getRoomDetails?bookingEngineId=4529&searchId=12345678&hotelId=123456
```

**Optional URL:**
```
https://preprod2.axisrooms.com/api/be/getRoomDetails?bookingEngineId=4529&searchId=12345678&hotelId=123456&currency=INR
```

### Request Parameters

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `bookingEngineId` | String | **Y** | Unique ID provided by AxisRooms |
| `searchId` | String | **Y** | Search ID obtained from Search API response |
| `hotelId` | String | **Y** | Hotel/Product ID for which room details are required |
| `currency` | String | Optional | Currency code (e.g., INR, USD, MYR) |

### Sample Response

```json
{
  "search_id": 31668609,
  "Hotel_Details": [
    {
      "hotel_id": 72397,
      "hotel_name": "CGH Earth Hotel",
      "description": "Luxury Resort with Nature Experience",
      "coordinates": {
        "latitude": "9.4981",
        "longitude": "76.3388"
      },
      "address": {
        "cityId": "7425",
        "city": "Kumarakom",
        "stateId": "883",
        "state": "Kerala",
        "countryId": "1",
        "country": "India",
        "address_Line": "Kavanattinkara, Kumarakom"
      },
      "property_type": "Luxury Resort",
      "amenities": [
        "Safe",
        "Complimentary Toiletries",
        "Wi-Fi (Complimentary)"
      ],
      "images": [
        "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/hotels/66776/resort-image.jpg"
      ],
      "inventory": 5,
      "rooms": [
        {
          "room_id": 22587,
          "rate_plans": [
            {
              "rate_plan_Id": 20539,
              "meal_plan": "Deluxe Room [CP]",
              "break_fast": true,
              "max_occupancy": 3,
              "deal": {
                "id": 0,
                "value": 0,
                "applicable": false
              },
              "price": {
                "actual": 10000,
                "discounted": 9500,
                "tax": 1710
              }
            },
            {
              "rate_plan_Id": 16954,
              "meal_plan": "Deluxe Room [MAP]",
              "break_fast": true,
              "max_occupancy": 3,
              "deal": {
                "id": 0,
                "value": 0,
                "applicable": false
              },
              "price": {
                "actual": 12000,
                "discounted": 11400,
                "tax": 2052
              }
            }
          ],
          "room_rank": 0,
          "type": "Deluxe Room",
          "inventory": 2,
          "amenities": ["AC", "TV", "Mini Bar"],
          "images": [
            "https://s3-ap-southeast-1.amazonaws.com/resources.axisrooms/static/rooms/22587/room-image.jpg"
          ],
          "taxes": [
            {
              "value": 18,
              "name": "GST",
              "type": "Percentage"
            }
          ],
          "description": "Spacious deluxe room with garden view"
        }
      ],
      "goodToKnow": [],
      "commute": [],
      "isWholeSaler": false,
      "preferedPosition": 0,
      "currency": "INR"
    }
  ]
}
```

---

## 4. Deals

Deals endpoint is used to fetch all the deals applicable for the client and their information.

**Method:** `GET`

**Basic URL:**
```
https://preprod2.axisrooms.com/api/be/deals?bookingEngineId=4529
```

**Optional URL (with productId):**
```
https://preprod2.axisrooms.com/api/be/deals?bookingEngineId=4529&productId=72397
```

### Request Parameters

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `bookingEngineId` | String | **Y** | Unique booking engine ID |
| `productId` | String | Optional | Hotel/Product ID to get deals for specific property |

### Sample Response

```json
{
  "dealsList": [
    {
      "id": 3073,
      "name": "Flat 10% Off",
      "description": "Book now and get 10% discount",
      "deal_type": "Basic",
      "discount_type": "Percentage",
      "value": 10,
      "price": 0
    },
    {
      "id": 3074,
      "name": "Long Stay Offer",
      "description": "Book more than 3 nights and get 15% off",
      "deal_type": "Long Stay",
      "discount_type": "Percentage",
      "value": 15,
      "price": 0
    },
    {
      "id": 3075,
      "name": "Early Bird Discount",
      "description": "Book 30 days in advance and get flat 5% discount",
      "deal_type": "Basic",
      "discount_type": "Percentage",
      "value": 5,
      "price": 0
    }
  ]
}
```

---

## 5. Promos

Promos endpoint is used to fetch all the Promotions applicable for the client and their information.

**Method:** `GET`

**Basic URL:**
```
https://preprod2.axisrooms.com/api/be/promos?bookingEngineId=4529
```

### Sample Response

```json
{
  "promos": [
    {
      "id": 6551,
      "code": "SUMMER2024",
      "description": "Now Get Flat 8% Off. Offer Valid Only For First Users. Use Given Promo Code To Avail The Discount. Offer Valid Only On Online Payments.",
      "type": "Percentage",
      "value": 8,
      "price": 10000,
      "promoAppliedPrice": 9200,
      "hotel": "CGH Earth Hotel",
      "currency": "INR"
    },
    {
      "id": 6549,
      "code": "WELCOME10",
      "description": "Welcome offer - 10% off on your first booking",
      "type": "Percentage",
      "value": 10,
      "price": 15000,
      "promoAppliedPrice": 13500,
      "hotel": "CGH Earth Hotel",
      "currency": "INR"
    }
  ]
}
```

---

## 6. Validate Promo

Validate Promo endpoint is used to validate the promo code provided by the Guest / Booker at the time of Booking and return its Promo value in response.

**Method:** `POST`

**URL:**
```
https://preprod2.axisrooms.com/api/be/validatePromo
```

### Request Parameters

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `hotelId` | String | **Y** | Unique hotel ID at AxisRooms |
| `checkInDate` | String | **Y** | Check in date (DD/MM/YYYY) |
| `checkOutDate` | String | **Y** | Check out date (DD/MM/YYYY) |
| `promoCode` | String | **Y** | Unique promo code to validate |
| `ratePlanId` | String | **Y** | Rate plan ID for which promotion is applicable |
| `rooms` | Array | **Y** | List of rooms and rate plan details |
| `roomId` | String | **Y** | Room ID for which promotion is applicable |
| `totalPrice` | int | **Y** | Total discounted price of a promotion |

### Sample Request

```json
{
  "totalPrice": 20400,
  "checkOutDate": "11/08/2024",
  "hotelId": "72397",
  "promoCode": "SUMMER2024",
  "rooms": [
    {
      "roomId": "22587",
      "ratePlanId": "16954"
    }
  ],
  "checkInDate": "10/08/2024"
}
```

### Sample Response - Success

```json
{
  "promoValid": true,
  "promoValue": 8,
  "promoType": "Percentage",
  "discountedPrice": 18768,
  "message": "Promo Code Applied Successfully"
}
```

### Sample Response - Error

```json
{
  "Error": {
    "ErrorCode": "ER602",
    "ErrorMessage": "Promo Code is Invalid"
  }
}
```

---

## 7. Policies / Addons

Policies endpoint is used to fetch all the addon policies and extras available for a booking.

**Method:** `GET`

**URL:**
```
https://preprod2.axisrooms.com/api/be/getPolicies?bookingEngineId=4529&searchId=12345678&hotelId=72397&ratePlanId=16954&roomTypeId=22587&currency=INR
```

### Request Parameters

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `bookingEngineId` | String | **Y** | Unique booking engine ID |
| `searchId` | String | **Y** | Search ID from Search API |
| `hotelId` | String | **Y** | Hotel/Product ID |
| `ratePlanId` | String | **Y** | Rate plan ID |
| `roomTypeId` | String | **Y** | Room type ID |
| `currency` | String | Optional | Currency code |

### Sample Response

```json
{
  "policies": [
    {
      "id": 1,
      "name": "Airport Transfer",
      "description": "One-way airport pickup/drop",
      "price": 2500,
      "type": "Per Booking"
    },
    {
      "id": 2,
      "name": "Ayurvedic Spa Package",
      "description": "60 minutes rejuvenation therapy",
      "price": 3500,
      "type": "Per Person"
    }
  ],
  "cancellationPolicy": "Free cancellation up to 24 hours before check-in",
  "checkInTime": "14:00",
  "checkOutTime": "11:00"
}
```

---

## 8. Final Prices

Final Prices endpoint is used to get the final prices for rooms including all taxes and charges.

**Method:** `GET`

**URL:**
```
https://preprod2.axisrooms.com/api/be/finalPrices?bookingEngineId=4529&searchId=12345678&hotelId=72397&ratePlanId=16954&roomTypeId=22587&paxInfo=2|0&currency=INR
```

### Request Parameters

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `bookingEngineId` | String | **Y** | Unique booking engine ID |
| `searchId` | String | **Y** | Search ID from Search API |
| `hotelId` | String | **Y** | Hotel/Product ID |
| `ratePlanId` | String | **Y** | Rate plan ID |
| `roomTypeId` | String | **Y** | Room type ID |
| `paxInfo` | String | **Y** | Guest information in format `adults\|children\|ages` |
| `currency` | String | Optional | Currency code |

### Sample Response

```json
{
  "searchId": 12345678,
  "hotelId": 72397,
  "roomTypeId": 22587,
  "ratePlanId": 16954,
  "basePrice": 9500,
  "taxAmount": 1710,
  "totalPrice": 11210,
  "currency": "INR",
  "taxes": [
    {
      "name": "GST",
      "value": 18,
      "type": "Percentage",
      "amount": 1710
    }
  ],
  "priceBreakup": [
    {
      "date": "10/08/2024",
      "price": 9500
    }
  ]
}
```

---

## 9. Booking / Payment

Booking API to push booking and process payment at AxisRooms.

### 9.1 Create Order

**Method:** `GET`

**URL:**
```
https://preprod2.axisrooms.com/api/be/getRoomDetails?bookingEngineId=4529&searchId=12345678&hotelId=72397&currency=INR
```

### 9.2 Make Payment (External Redirect)

**Method:** `POST` (Form Redirect)

**URL:**
```
https://app.axisrooms.com/beV2/hotelBooking.html
```

### Request Parameters

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `searchId` | String | **Y** | Search ID from Search API |
| `hotelId` | String | **Y** | Hotel ID |
| `bookedRooms` | String | **Y** | Rooms being booked |
| `ratePlanId` | String | **Y** | Rate plan ID |
| `roomTypeId` | String | **Y** | Room type ID |
| `noOfRooms` | int | **Y** | Number of rooms |
| `title` | String | **Y** | Guest title (Mr/Mrs/Ms) |
| `firstName` | String | **Y** | Guest first name |
| `lastName` | String | **Y** | Guest last name |
| `email` | String | **Y** | Guest email address |
| `mobile` | String | **Y** | Guest mobile number |
| `country` | String | **Y** | Guest country |
| `paymentType` | String | **Y** | Payment method type |
| `paymentGatewayId` | String | **Y** | Payment gateway ID |
| `promoCode` | String | Optional | Promotional code if applicable |
| `remarks` | String | Optional | Special remarks/requests |
| `gstNo` | String | Optional | GST number for invoice |

### Card Payment Parameters (if applicable)

| Parameter Name | Type | Required | Description |
|----------------|------|----------|-------------|
| `cardHolderName` | String | **Y** | Name on card |
| `cardNumber` | String | **Y** | Card number |
| `cvv` | String | **Y** | CVV/CVC code |
| `expiryMonth` | String | **Y** | Card expiry month |
| `expiryYear` | String | **Y** | Card expiry year |
| `bankName` | String | Optional | Bank name |

### Sample Booking Response

```json
{
  "bookingId": "AXR3456",
  "reference_id": "ARK00081U8ZL",
  "hotelId": "72397",
  "status": "Confirmed",
  "message": "Booking Confirmed",
  "checkInDate": "10/08/2024",
  "checkOutDate": "11/08/2024",
  "noOfRooms": "1",
  "totalPax": "2",
  "rooms": [
    {
      "amount": 11210,
      "numOfAdults": 2,
      "roomId": "22587",
      "ratePlanId": "16954",
      "numOfChildren": 0
    }
  ],
  "firstName": "John",
  "lastName": "Doe",
  "mobileNo": "9876543210",
  "emailId": "john.doe@email.com",
  "address": "123, Sample Street, Bangalore"
}
```

### Booking Status Values

| Status | Description |
|--------|-------------|
| `Confirmed` | Booking successfully confirmed |
| `Modified` | Booking has been modified |
| `Cancelled` | Booking has been cancelled |
| `Aborted` | Payment/Booking was aborted |
| `Charging` | Payment is being processed |

---

## 10. Location

Location endpoint is used to fetch the location related information like Countries, States and Cities for which there are VALID properties associated with the Client.

**Method:** `GET`

**Basic URL:**
```
https://preprod2.axisrooms.com/api/be/location?bookingEngineId=4529
```

### Sample Response

```json
{
  "locations": [
    {
      "country_id": 1,
      "country": "India",
      "state_id": 883,
      "state": "Kerala",
      "city_id": 7425,
      "city": "Kumarakom",
      "latitude": "9.4981",
      "longitude": "76.3388"
    },
    {
      "country_id": 1,
      "country": "India",
      "state_id": 883,
      "state": "Kerala",
      "city_id": 388,
      "city": "Kochi",
      "latitude": "9.9312",
      "longitude": "76.2673"
    },
    {
      "country_id": 1,
      "country": "India",
      "state_id": 500,
      "state": "Karnataka",
      "city_id": 1217,
      "city": "Bangalore",
      "latitude": "12.9716",
      "longitude": "77.5946"
    }
  ]
}
```

> **Note:** If Geo-Location data is not available, `"0.0"` will be passed as value for `latitude` and `longitude` keys in the results.

---

## API Endpoints Summary

| # | Endpoint | Method | Description |
|---|----------|--------|-------------|
| 1 | `/api/be/search` | GET | Search hotels and get pricing |
| 2 | `/api/be/getRoomDetails` | GET | Get room types and rate plans |
| 3 | `/api/be/deals` | GET | Get available deals |
| 4 | `/api/be/promos` | GET | Get promotional offers |
| 5 | `/api/be/validatePromo` | POST | Validate promo code |
| 6 | `/api/be/getPolicies` | GET | Get policies and addons |
| 7 | `/api/be/finalPrices` | GET | Get final prices with taxes |
| 8 | `/api/be/location` | GET | Get location information |
| 9 | `/beV2/hotelBooking.html` | POST | Process booking and payment |

---

## Error Codes

| Error Code | Description |
|------------|-------------|
| ER601 | Invalid Booking Engine ID |
| ER602 | Promo Code is Invalid |
| ER603 | Search ID Expired |
| ER604 | Hotel Not Available |
| ER605 | Room Not Available |
| ER606 | Invalid Date Format |
| ER607 | Payment Failed |
| ER608 | Invalid Request Parameters |

---

## Notes

1. **All API calls require default headers** containing `apiKey`, `channelId`, and `Content-Type`

2. **Date format** across all endpoints is **DD/MM/YYYY**

3. **paxInfo format:** `adults|children|childAge1|childAge2...` For multiple rooms, separate with `||`

4. **Payment flow** redirects to an external AxisRooms payment gateway URL

5. **Search ID** is valid for a limited time and should be used for subsequent API calls

---

**CGH Booking Engine - API Documentation Version: 1.0 Date: 02 Feb 2026**
