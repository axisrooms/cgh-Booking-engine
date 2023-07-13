export interface BookingCart {
    bookingItems: BookingItem[],
    currIndex?: number,
    loadingPaymentGateway? : boolean
}

export interface BookingItem {
    property:any
    addons?: Addon[],
    addonTotalPrice:number,
    prevUrl?: string,
    searchId: number,
    hotelId: number,
    checkIn: string,
    checkOut: string,
    cityId: number,
    noOfRooms: number,
    totalAmount: number,
    paxInfo: string,
    noOfDays: number,
    noOfAdults: number,
    noOfChildren:number,
    agesOfChildren: number[],
    rooms: Room[],
    renderData?: any,
    payathotel:any

}

export interface Room {
    ratePlanId: number,
    roomId: number,
    currency:string
    price: {
        actual: number,
        discounted: number,
        taxValue: number
    }
}

export interface Addon {
    cost: number,
    totalCost: number,
    currency: string,
    mandatory: boolean,
    policy_description: string,
    policy_id: string,
    policy_image_url: string,
    policy_name: string,
    policy_type_id: string,
    policy_type_name: string,
    qty: number,
}