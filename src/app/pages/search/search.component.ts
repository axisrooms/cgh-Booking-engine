import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import * as moment from 'moment';
import { HotelDetails } from 'src/app/shared/models/hotel-details.model';
import { DateRange } from '@angular/material/datepicker';
import { BOOKING_ENGINE_ID } from 'src/app/shared/constants/url.constants';
import { BookingConfigService } from 'src/app/services/bookingid.service';
import { BookingService } from 'src/app/services/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropdownType } from 'src/app/shared/models/dropdown-type';
import { DealsService } from 'src/app/services/deals.service';
import { formatDate, NgIf } from '@angular/common';
import { BookingCart, BookingItem } from '../../shared/models/booking.model';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  dropdownType = DropdownType;
  showDropdown: DropdownType = DropdownType.none;
  showFieldWarnings!: DropdownType;
  isSelectingOption: boolean = false; // Flag to prevent dropdown reopening after selection
  previousBookingEngineId: number | null = null; // Track previous booking engine ID
  minDate: Date | undefined;
  searchId!: any;
  flag: any;
  age: any = new Map();
  activateRouteSubscription$!: Subscription;

  searchForm!: FormGroup;
  agesArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  hotelsList: HotelDetails[] = [];
  filteredHotelsList!: Observable<HotelDetails[]>;
  isHotelListLoaded!: boolean;

  locationList: any = [];
  filteredLocationList!: Observable<any>;

  searchResponse: any;
  hotelBackgroundImage: string = '';
  searchTypeControlSubscription!: Subscription;
  isCurrentCalendarInputCheckout!: boolean;
  roomCount: any;
  bookingItems: BookingItem[] | undefined = [];
  bookingCart$: Observable<BookingCart | undefined> | undefined;

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dealsService: DealsService,
    public bookingService: BookingService,
    private BookingConfigService: BookingConfigService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.bookingCart$ = this.bookingService.bookingCart$
    this.bookingCart$.subscribe(res => {
      this.bookingItems = res?.bookingItems

    })
    this.bookingService.cartflag = false;
    this.minDate = new Date();
    this.searchForm = this.getsearchForm();
    console.log(this.searchForm.value,
      this.searchForm.controls.paxData.value[0].noOfAdults)
    
    // Initialize previousBookingEngineId from the service
    this.previousBookingEngineId = this.BookingConfigService.getBookingEngineId();
    console.log('Initial booking engine ID on component load:', this.previousBookingEngineId);
    
    this.getWithExpiry();
    console.log(this.searchForm, "searchform")
    this.filteredHotelsList = this.searchForm.controls.hotel.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterHotel(value))
    );

    this.filteredLocationList =
      this.searchForm.controls.hotel.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterLocation(value))
      );

    this.activateRouteSubscription$ = this.activatedRoute.queryParams.pipe(
      debounceTime(300)
    ).subscribe(
      async (queryParams) => {
        console.log('========================================');
        console.log('SearchComponent: Query params changed!');
        console.log('All query params:', queryParams);
        console.log('Current router URL:', this.router.url);
        console.log('========================================');
        
        // Get the current booking engine ID from URL
        const currentBookingEngineId = queryParams['bookingEngineId'] 
          ? Number(queryParams['bookingEngineId']) 
          : null;
        
        console.log('Previous booking engine ID:', this.previousBookingEngineId);
        console.log('Current booking engine ID:', currentBookingEngineId);
        
        // Check if bookingEngineId has actually changed
        if (currentBookingEngineId && currentBookingEngineId !== this.previousBookingEngineId) {
          console.log('🔄 Booking Engine ID CHANGED! Reloading hotels for ID:', currentBookingEngineId);
          
          // Update the previous ID
          this.previousBookingEngineId = currentBookingEngineId;
          
          // Clear cached data and reload hotels for the new booking engine
          this.flag = null;
          this.hotelsList = [];
          this.locationList = [];
          this.isHotelListLoaded = false;
          localStorage.removeItem('hotel');
          
          // Force reload hotels
          await this.getAllHotels();
        } else if (currentBookingEngineId && !this.previousBookingEngineId) {
          // First time loading - set the initial booking engine ID
          console.log('📌 Initial booking engine ID set to:', currentBookingEngineId);
          this.previousBookingEngineId = currentBookingEngineId;
        }

        if (!queryParams['checkIn']) {
          localStorage.removeItem('reflectStore');
        }
        
        if (queryParams['checkIn']) {
          this.roomCount = queryParams['rooms']

          this.searchForm.controls.checkIn.setValue(queryParams['checkIn']);
          this.searchForm.controls.checkOut.setValue(queryParams['checkOut']);
          this.searchForm.controls.cityId.setValue(queryParams['cityId'] || '');
          this.searchForm.controls.stateId.setValue(queryParams['stateId']);
          this.searchForm.controls.countryId.setValue(queryParams['countryId']);
          this.searchForm.controls.searchType.setValue(
            queryParams['searchType'] || 'hotel'
          );
          await this.setHotelName(parseInt(queryParams['productId']));
          this.setLocation(queryParams['cityId'], queryParams['stateId']);
          
          // Set paxInfo first (this will rebuild the paxData array)
          this.setPaxInfo(queryParams['paxInfo']);
          
          // Set rooms from query params (or use paxData length if not present)
          let roomsCount = queryParams['rooms'] ? Number(queryParams['rooms']) : this.getTablesFormArray().length;
          
          // Ensure roomsCount is a valid positive number
          if (isNaN(roomsCount) || roomsCount < 1) {
            roomsCount = 1;
          }
          
          this.searchForm.controls.rooms.setValue(roomsCount);
          
          // Update localStorage to match the query params
          localStorage.setItem('rooms', roomsCount.toString());
          
          this.fetchSearchResult();
        }
      }
    );
  }
  // increment() {
  //   // this.roomCount++
  //   // this.roomCountChanged()
  //   let current = this.searchForm.controls.rooms.value;
  //   this.searchForm.controls.rooms.setValue(current + 1);
  //   this.roomCount = this.searchForm.controls.rooms.value
  // }

  // decrement() {
  //   // if (this.roomCount > 1) {
  //   //   this.roomCount--
  //   //   this.roomCountChanged()
  //   // }
  //   let current = this.searchForm.controls.rooms.value;
  //   if (current > 1) {
  //     this.searchForm.controls.rooms.setValue(current - 1);
  //     this.roomCount = this.searchForm.controls.rooms.value
  //   }
  // }
  // roomCountChanged() {
  //   this.data = []
  //   for (var i = 0; i < this.roomCount; i++) {
  //     this.data.push({
  //       numOfAdults: 0,
  //       numOfChildren: 0,
  //       childAges: []
  //     })
  //   }
  // }

  // adultCountChanged(index: number, value: any) {
  //   this.data[index].numOfAdults = parseFloat(value)
  // }
  // childCountChanged(index: number, value: any) {
  //   this.data[index].numOfChildren = parseFloat(value)
  //   this.data[index].childAges = []
  //   for (var i = 0; i < value; i++) {
  //     this.data[index].childAges.push(0)
  //   }
  // }
  // onChildAgeChange(roomIndex: any, childIndex: any, value: any) {
  //   //console.log(roomIndex, childIndex, value)
  //   this.data[roomIndex].childAges[childIndex] = parseFloat(value)
  //   //console.log(this.data)
  // }
  // incrementAdult(room: { numOfAdults: number; }) {
  //   room.numOfAdults++
  // }
  // decrementAdult(room: { numOfAdults: number; }) {
  //   if (room.numOfAdults > 1) {
  //     room.numOfAdults--
  //   }
  // }
  // incrementChild(room: { numOfChildren: number; childAges: number[]; }) {
  //   room.numOfChildren++
  //   room.childAges = []
  //   for (var i = 0; i < room.numOfChildren; i++) {
  //     room.childAges.push(0)
  //   }
  // }
  // decrementChild(room: { numOfChildren: number; childAges: number[]; }) {
  //   if (room.numOfChildren > 0) {
  //     room.numOfChildren--
  //     room.childAges = []
  //     for (var i = 0; i < room.numOfChildren; i++) {
  //       room.childAges.push(0)
  //     }
  //   }
  // }

  ngOnDestroy(): void {
    this.searchTypeControlSubscription?.unsubscribe();
  }

  getsearchForm() {
    let dt = formatDate(new Date(), 'dd/MM/yyyy', 'en')

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    let dtTom = formatDate(tomorrow, 'dd/MM/yyyy', 'en')

    console.log(dtTom)
    return this.formBuilder.group({
      searchType: [],
      hotel: ['', Validators.required],
      location: [''],
      cityId: [''],
      stateId: [''],
      countryId: [''],
      checkIn: [dt, Validators.required],
      checkOut: [dtTom, Validators.required],
      noOfAdults: [2],
      agesOfChildren: this.formBuilder.array([]),
      rooms: [1],
      paxData: this.formBuilder.array([
        this.formBuilder.group({
          noOfAdults: [2],
          noOfChildren: [0],
          agesOfChildren: this.formBuilder.array([])
        })
      ]),

    });


  }

  addAges(i: any, index: number, index1: number) {

    console.log(i.target.value, index, index1)
    var title = index + index1;
    this.age.delete(index + index1)
    this.age.set(title, i.target.value)

    console.log(this.age)
  }
  getChildrenAgeFormArray(index: number): FormArray {
    const roomFormGroup = this.getTablesFormArray().at(index) as FormGroup;
    return roomFormGroup.get('agesOfChildren') as FormArray;
  }

  getChildrenAgeFormArray_1() {
    return this.formBuilder.control('')
  }

  removeAge(i: number, ind: number) {
    this.getChildrenAgeFormArray(i).removeAt(ind)

  }

  getTablesFormArray(): FormArray {
    return this.searchForm.get("paxData") as FormArray;
  }

  addTablesForm() {
    console.log(this.getTablesForm())
    this.getTablesFormArray().push(this.getTablesForm());
  }
  removeTable(index: number) {
    this.getTablesFormArray().removeAt(index)
  }
  getTablesForm() {
    return this.formBuilder.group({
      noOfAdults: [2],
      noOfChildren: [0],
      agesOfChildren: this.formBuilder.array([])
    });
  }

  // getChildrenAgeFormArray(i: number): FormArray {
  //   return this.searchForm.controls.paxData.value[i].get('agesOfChildren') as FormArray;
  // }

  // addAge(data: any, i: number) {
  //   console.log(data)
  //   // this.getChildrenAgeFormArray(i).push(data)
  // }



  filterHotel(value: any): any[] {
    this.getWithExpiry();
    if (!value) value = '';
    
    // Check if hotelsList exists and is an array
    if (!this.hotelsList || !Array.isArray(this.hotelsList)) {
      this.hotelsList = [];
      return [];
    }
    
    let filterValue = value?.toLowerCase();
    let filteredArray = this.hotelsList.filter((val) =>
      val.hotel_name?.toLowerCase().indexOf(filterValue) > -1
    );

    // Show dropdown when there are results (don't hide here, let the combined logic handle it)
    if (!this.isSelectingOption && filteredArray.length > 0) {
      this.showDropdown = DropdownType.hotel;
    }
    
    return filteredArray;
  }

  filterLocation(value: any): any[] {
    this.getWithExpiry();
    if (!value) value = '';
    
    // Check if locationList exists and is an array
    if (!this.locationList || !Array.isArray(this.locationList)) {
      this.locationList = [];
      return [];
    }
    
    let filterValue = value?.toLowerCase();
    let filteredArray = this.locationList.filter((val: any) =>
      val.key?.toLowerCase().indexOf(filterValue) > -1
    );
    
    // Show dropdown when there are results (hotel dropdown also shows locations)
    if (!this.isSelectingOption && filteredArray.length > 0) {
      this.showDropdown = DropdownType.hotel;
    }

    console.log(this.locationList, filteredArray, "########")
    return filteredArray;
  }

  setWithExpiry(value: any) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime(),
    }
    localStorage.setItem('hotel', JSON.stringify(item))
  }

  async getAllHotels() {
    console.log('getAllHotels called with checkIn date:', this.searchForm.controls.checkIn.value);
    console.log('Current bookingEngineId:', this.BookingConfigService.getBookingEngineId());
    
    try {
      const res = await this.searchService
        .getAllHotels(this.searchForm.controls.checkIn.value)
        .toPromise();
      
      console.log('getAllHotels API response:', res);
      
      if (res && res['Hotel_Details']) {
        console.log('Number of hotels received:', res['Hotel_Details'].length);
        const hotelDetails = res['Hotel_Details'];
        
        // Store in localStorage
        this.setWithExpiry(hotelDetails);
        
        // Immediately populate the lists for UI display
        this.hotelsList = hotelDetails;
        this.getLocationList(hotelDetails);
        this.isHotelListLoaded = true;
        
        console.log('hotelsList populated with:', this.hotelsList.length, 'hotels');
        console.log('locationList populated with:', this.locationList.length, 'locations');
      } else {
        console.error('No Hotel_Details in response:', res);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
    }
  }
  getWithExpiry() {
    const itemStr = localStorage.getItem('hotel')
    if (this.flag == null) {
      this.flag = true;
    }

    // if the item doesn't exist, return null
    if (!itemStr && this.flag == true) {
      this.getAllHotels();
      this.flag = false;
      return; // Return early, hotels will be loaded asynchronously
    }
    let item
    if (itemStr && this.flag == true) {
      item = JSON.parse(itemStr)
      const now = new Date()
      // compare the expiry time of the item with the current time
      if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem('hotel');

        this.getAllHotels();
        this.flag = false;
        return; // Return early, hotels will be loaded asynchronously
      }
      
      // Check if item.value exists and is an array before using it
      if (item.value && Array.isArray(item.value)) {
        this.hotelsList = item.value;
        this.getLocationList(item.value);
        this.isHotelListLoaded = true;
      } else {
        // If invalid data, fetch fresh data
        localStorage.removeItem('hotel');
        this.getAllHotels();
        this.flag = false;
      }
      return;
    }

  }
  getLocationList(val: any) {
    // Check if val exists and is an array
    if (!val || !Array.isArray(val)) {
      console.warn('getLocationList called with invalid data:', val);
      return;
    }
    
    val.forEach((e1: any) => {
      //Push city if available
      if (e1.address.city) {
        let obj1 = {
          key: e1.address.city,
          type: 'city',
          cityId: e1.address.cityId,
          state: e1.address.state,
          stateId: e1.address.stateId,
          country: e1.address.country,
          countryId: e1.address.countryId,
        };
        let isFound = false;
        for (let index = 0; index < this.locationList.length; index++) {
          if (this.locationList[index].key === e1.address.city) {
            isFound = true;
            break;
          }
        }
        if (!isFound) this.locationList.push(obj1);
      }

      //Push state
      let obj2 = {
        key: e1.address.state,
        type: 'state',
        stateId: e1.address.stateId,
        country: e1.address.country,
        countryId: e1.address.countryId,
      };
      let isFound = false;
      for (let index = 0; index < this.locationList.length; index++) {
        if (this.locationList[index].key === e1.address.state) {
          isFound = true;
          break;
        }
      }
      if (!isFound) this.locationList.push(obj2);
    });
  }

  toggleDropdown(type: DropdownType) {
    this.showDropdown = this.showDropdown != type ? type : DropdownType.none;
    this.showFieldWarnings = this.dropdownType.none;
    if (type === DropdownType.checkin || type === DropdownType.checkout) {
      this.updateHeaderText();
    }
  }

  changeSearchType(val: string) {
    console.log(val)
    this.searchForm.controls.searchType.setValue(val);
    if (val === 'hotel') {
      this.searchForm.controls.hotel.setValidators([Validators.required]);
      this.searchForm.controls.location.setValidators([]);
    }
    if (val === 'location') {
      this.searchForm.controls.hotel.setValidators([]);
      this.searchForm.controls.location.setValidators([Validators.required]);
    }

  }

  async onHotelFieldEvent(type: string, event?: any) {
    if (!this.isHotelListLoaded) {
      this.getWithExpiry();
    }
    if (type === 'focus') {
      this.showDropdown = this.dropdownType.hotel;
      this.filterHotel(this.searchForm.controls.hotel.value);
      this.filterLocation(this.searchForm.controls.hotel.value);
    } else if (type === 'input' || type === 'keydown') {
      this.showDropdown = this.dropdownType.hotel;
      // For input events, get the value from the event target
      const searchValue = event?.target?.value ?? this.searchForm.controls.hotel.value;
      this.filterHotel(searchValue);
      this.filterLocation(searchValue);
    }
  }

  onLocationFieldEvent(type: string, event?: any) {
    if (!this.isHotelListLoaded) {
      this.getWithExpiry();
    }
    if (type === 'focus') {
      this.filterLocation(this.searchForm.controls.location.value);
    } else if (type === 'keydown') {
      this.filterLocation(this.searchForm.controls.location.value);
    }
  }

  focusDestinationFieldInput(type: string) {
    if (type === 'hotel') {
      document.getElementById('hotel-field-input')?.focus();
      this.showDropdown = this.dropdownType.hotel;
    } else {
      document.getElementById('location-field-input')?.focus();
      this.showDropdown = this.dropdownType.location;
    }
    this.showFieldWarnings = this.dropdownType.none;
  }

  selectHotel(name: string, event?: MouseEvent) {
    // Prevent event from bubbling to parent elements
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Set flag to prevent dropdown from reopening
    this.isSelectingOption = true;
    
    this.searchForm.controls.hotel.setValue(name);
    this.searchForm.controls.searchType.setValue('hotel');
    
    // Close dropdown immediately
    this.showDropdown = DropdownType.none;
    this.showFieldWarnings = DropdownType.none;
    
    // Blur the input field and reset flag
    setTimeout(() => {
      document.getElementById('hotel-field-input')?.blur();
      // Reset flag after a short delay to allow valueChanges to complete
      setTimeout(() => {
        this.isSelectingOption = false;
      }, 100);
    }, 0);
  }

  selectLocation(option: any, event?: MouseEvent) {
    // Prevent event from bubbling to parent elements
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Set flag to prevent dropdown from reopening
    this.isSelectingOption = true;
    
    // Set form values based on location selection
    if (option.type === 'city') {
      this.searchForm.controls.hotel.setValue(option.key);
      this.searchForm.controls.cityId.setValue(option.cityId);
      this.searchForm.controls.searchType.setValue('location');
    }
    
    this.searchForm.controls.stateId.setValue(option.stateId);
    this.searchForm.controls.countryId.setValue(option.countryId);
    this.searchForm.controls.location.setValue(option.key);
    
    // Close dropdown immediately
    this.showDropdown = DropdownType.none;
    this.showFieldWarnings = DropdownType.none;
    
    // Blur the input field and reset flag
    setTimeout(() => {
      document.getElementById('hotel-field-input')?.blur();
      // Reset flag after a short delay to allow valueChanges to complete
      setTimeout(() => {
        this.isSelectingOption = false;
      }, 100);
    }, 0);
  }

  async setHotelName(id: number) {
    // Wait for hotels to load if not already loaded
    if (!this.isHotelListLoaded || this.hotelsList.length === 0) {
      await this.getAllHotels();
    }
    
    let hotelName = '';
    for (let i = 0; i < this.hotelsList.length; i++) {
      if (this.hotelsList[i].hotel_id === id) {
        hotelName = this.hotelsList[i].hotel_name;
        break;
      }
    }
    this.searchForm.controls.hotel.setValue(hotelName);
  }

  setLocation(cityId: any, stateId: any) {
    let location = '';
    for (let index = 0; index < this.locationList.length; index++) {
      if (cityId) {
        if (this.locationList[index].cityId === cityId) {
          location = this.locationList[index]['key'];
        }
      } else {
        if (this.locationList[index].stateId === stateId) {
          location = this.locationList[index]['key'];
        }
      }
      this.searchForm.controls.location.setValue(location);
    }
  }

  //Ages Methods
  // get agesOfChildren() {
  //   return this.searchForm.get('agesOfChildren') as FormArray;
  // }

  // getChildrensAgeForm() {
  //   return this.formBuilder.group({
  //     age: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.pattern(/^[0-9]\d*$/),
  //         Validators.min(1),
  //         Validators.max(12),
  //       ],
  //     ],
  //   });
  // }

  // updateChildrensAgeForm(type: string) {
  //   if (type === 'add') {
  //     this.agesOfChildren.push(this.getChildrensAgeForm());
  //   } else if (type === 'remove') {
  //     this.agesOfChildren.removeAt(this.agesOfChildren.length - 1);
  //   }
  // }


  updateroomCount(type: string) {
    let current = this.searchForm.controls.rooms.value;
    
    // Ensure current is a valid number
    if (isNaN(current) || current === null || current === undefined) {
      current = 1;
      this.searchForm.controls.rooms.setValue(1);
    }
    
    if (type === 'decrement') {
      if (current > 1) {
        this.searchForm.controls.rooms.setValue(current - 1);
        this.removeTable(this.searchForm.controls.rooms.value)
      }
    } else if (type === 'increment') {
      this.searchForm.controls.rooms.setValue(current + 1);
      this.addTablesForm()
      console.log(this.searchForm.value)
    }
    localStorage.removeItem('rooms')
    localStorage.setItem('rooms', String(this.searchForm.controls.rooms.value))

  }

  updateAdultCount(type: string, i: number) {
    const roomFormGroup = this.getTablesFormArray().at(i) as FormGroup;
    if (type === 'decrement') {
      let current = roomFormGroup.get('noOfAdults')?.value;
      if (current > 1) {
        roomFormGroup.get('noOfAdults')?.setValue(current - 1);
        console.log(this.searchForm.controls.paxData)
      }
    } else if (type === 'increment') {
      let current = roomFormGroup.get('noOfAdults')?.value;
      roomFormGroup.get('noOfAdults')?.setValue(current + 1);
    }
  }

  updateChildCount(type: string, i: number) {
    const roomFormGroup = this.getTablesFormArray().at(i) as FormGroup;
    if (type === 'decrement') {
      let current = roomFormGroup.get('noOfChildren')?.value;
      if (current > 0) {
        roomFormGroup.get('noOfChildren')?.setValue(current - 1);
        this.removeAge(i, current - 1);
      }
    } else if (type === 'increment') {
      let current = roomFormGroup.get('noOfChildren')?.value;
      if (current < 3) {
        roomFormGroup.get('noOfChildren')?.setValue(current + 1);
        var title = i + current.length + 1;
        this.age.set(title, 1);
      }
    }

    console.log(this.searchForm.value, "@#$%^&*(")
  }

  saveRoomConfiguration() {
    // Close the dropdown after saving room configuration
    this.showDropdown = this.dropdownType.none;
    console.log('Room configuration saved:', this.searchForm.controls.paxData.value);
  }



  onSubmit() {
    console.log(this.searchForm, this.searchForm.valid)
    this.searchForm.markAllAsTouched();
    this.showDropdown = this.dropdownType.none;
    
    // Check if hotel field is empty
    if (!this.searchForm.controls.hotel.value || this.searchForm.controls.hotel.value.trim() === '') {
      this.showFieldWarnings = this.dropdownType.hotel;
      return;
    }
    
    // if(      this.searchForm.controls.searchType.status== "VALID" ){
    //   this.searchForm.valid
    // }
    if (this.searchForm.controls.searchType.status == "VALID") {
      let prevUrl = this.router.url.toString();
      let searchParams: any = this.getSearchParams();
      searchParams['searchType'] = this.searchForm.controls.searchType.value;
      this.router
        .navigate(['/search'], { queryParams: searchParams })
        .then((res) => {
          if (prevUrl === this.router.url.toString()) this.scrollToSearchView();
        });
    } else {
      if (
        this.searchForm.controls.hotel.invalid &&
        (this.searchForm.controls.hotel.dirty ||
          this.searchForm.controls.hotel.touched)
      ) {
        this.showFieldWarnings = this.dropdownType.hotel;
      } else if (
        this.searchForm.controls.checkIn.invalid &&
        (this.searchForm.controls.checkIn.dirty ||
          this.searchForm.controls.checkIn.touched)
      ) {
        this.showFieldWarnings = this.dropdownType.checkin;
      } else if (
        this.searchForm.controls.checkOut.invalid &&
        (this.searchForm.controls.checkOut.dirty ||
          this.searchForm.controls.checkOut.touched)
      ) {
        this.showFieldWarnings = this.dropdownType.checkout;
      }
    }
  }

  fetchSearchResult() {
    if (this.searchForm.valid) {
      this.spinner.show();
      let searchParams: any = this.getSearchParams();
      console.log(searchParams, "searchparams")
      this.searchService.searchRooms(searchParams).subscribe((res) => {
        this.searchId = res['search_id'];
        this.searchResponse = res;
        console.log(this.searchResponse)
        
        // Update background image when search response is received
        this.updateBackgroundImage();
        
        this.scrollToSearchView();
        this.spinner.hide();

        console.log(this.searchResponse)
      });
    }
  }

  updateBackgroundImage() {
    // Check if searchResponse has Hotel_Details and if the first hotel has images
    console.log('Search Response:', this.searchResponse);
    
    if (this.searchResponse && 
        this.searchResponse.Hotel_Details && 
        this.searchResponse.Hotel_Details.length > 0) {
      
      const firstHotel = this.searchResponse.Hotel_Details[0];
      console.log('First Hotel:', firstHotel);
      console.log('First Hotel Images:', firstHotel.images);
      
      if (firstHotel.images && firstHotel.images.length > 0) {
        // Use the first image of the first hotel
        this.hotelBackgroundImage = firstHotel.images[0];
        console.log('Updated background image to:', this.hotelBackgroundImage);
      } else {
        // Reset to default
        this.hotelBackgroundImage = '';
        console.log('No images found in hotel, reset to default background image');
      }
    } else {
      // Reset to default
      this.hotelBackgroundImage = '';
      console.log('No Hotel_Details found, reset to default background image');
    }
    
    // Trigger change detection
    this.cdr.detectChanges();
  }

  getBackgroundImageStyle() {
    // Check if hotel background image is set
    if (this.hotelBackgroundImage) {
      return {
        'background-image': `url(${this.hotelBackgroundImage})`,
        'background-position': 'center',
        'background-size': 'cover'
      };
    }
    
    // Fallback to default background image
    return {
      'background-image': 'url(../../../assets/images/background.jpg)',
      'background-position': 'center',
      'background-size': 'cover'
    };
  }



  scrollToSearchView() {
    var element = document.getElementById('searchTitleId');
    var headerOffset = 250;
    var elementPosition = element?.getBoundingClientRect().top;
    if (elementPosition) {
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  getSearchParams() {
    let searchParams: any = {
      bookingEngineId: this.BookingConfigService.getBookingEngineId()
    };

    if (this.getProductId()) {
      searchParams.productId = this.getProductId();
    }


    if (this.searchForm.controls.cityId.value?.length > 0) {
      searchParams.cityId = this.searchForm.controls.cityId.value;
    }
    // searchParams.stateId = this.searchForm.controls.stateId.value;
    // searchParams.countryId = this.searchForm.controls.countryId.value;

    if (this.searchForm.controls.checkIn.value?.length > 0) {
      searchParams.checkIn = this.searchForm.controls.checkIn.value;
    }
    if (this.searchForm.controls.checkOut.value?.length > 0) {
      searchParams.checkOut = this.searchForm.controls.checkOut.value;
    }
    if (this.getPaxInfo()) {
      searchParams.paxInfo = this.getPaxInfo();
    }
    
    // Include rooms in search params
    searchParams.rooms = this.searchForm.controls.rooms.value;

    return searchParams;
  }

  getProductId() {
    let productId;
    for (let i = 0; i < this.hotelsList.length; i++) {
      if (
        this.hotelsList[i].hotel_name === this.searchForm.controls.hotel.value
      ) {
        productId = this.hotelsList[i].hotel_id;
        break;
      }
    }
    return productId;
  }

  getPaxInfo() {
    let guests = 0;
    let paxParts: string[] = [];
    let aFromArray: FormArray = this.getTablesFormArray();
    
    // Loop through all rooms
    for (let i = 0; i < aFromArray.length; i++) {
      let roomPax: string[] = [];
      const noOfAdults = aFromArray.value[i]['noOfAdults'] || 0;
      const noOfChildren = aFromArray.value[i]['noOfChildren'] || 0;
      
      roomPax.push(noOfAdults.toString());
      roomPax.push(noOfChildren.toString());
      
      guests += noOfAdults + noOfChildren;
      
      // Add children ages if any
      if (noOfChildren > 0) {
        let agesFormArray: FormArray = this.getChildrenAgeFormArray(i);
        for (let ii = 0; ii < noOfChildren; ii++) {
          const age = this.age.get(i + '' + ii) || 0;
          roomPax.push(age.toString());
        }
      }
      
      paxParts.push(roomPax.join('|'));
    }
    
    const paxString = paxParts.join('||');
    
    localStorage.removeItem('guests');
    localStorage.setItem('guests', guests.toString());
    console.log(paxString, "paxstring");
    return paxString;
  }

  setPaxInfo(paxInfo: any) {
    if (!paxInfo) return;
    
    // Clear existing paxData
    const paxDataArray = this.getTablesFormArray();
    while (paxDataArray.length > 0) {
      paxDataArray.removeAt(0);
    }
    
    const paxString = paxInfo.toString();
    let rooms: string[] = [];
    
    // Check if it's the new format (rooms separated by ||) or old format
    if (paxString.includes('||')) {
      rooms = paxString.split('||').filter((r: string) => r.length > 0);
    } else {
      // Old format - try to parse as single room or multiple rooms separated by single |
      // Format: adults|children|age1|age2|...
      rooms = [paxString];
    }
    
    rooms.forEach((roomData: string, roomIndex: number) => {
      let paxArray = roomData.split('|').filter((p: string) => p !== '');
      
      if (paxArray.length >= 2) {
        const noOfAdults = parseInt(paxArray[0]) || 2;
        const noOfChildren = parseInt(paxArray[1]) || 0;
        
        // Create a new room FormGroup
        const roomFormGroup = this.formBuilder.group({
          noOfAdults: [noOfAdults],
          noOfChildren: [noOfChildren],
          agesOfChildren: this.formBuilder.array([])
        });
        
        // Add children ages if any
        if (noOfChildren > 0 && paxArray.length > 2) {
          for (let i = 0; i < noOfChildren && i + 2 < paxArray.length; i++) {
            const age = parseInt(paxArray[i + 2]) || 1;
            this.age.set(roomIndex + '' + i, age);
          }
        }
        
        paxDataArray.push(roomFormGroup);
      }
    });
    
    // If no rooms were added, add a default room
    if (paxDataArray.length === 0) {
      paxDataArray.push(this.formBuilder.group({
        noOfAdults: [2],
        noOfChildren: [0],
        agesOfChildren: this.formBuilder.array([])
      }));
    }
  }

  clearFormArray = (formArray: FormArray) => {
    formArray = this.formBuilder.array([]);
  }

  @Input() selectedRangeValue: DateRange<Date> | undefined;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();

  now = new Date();
  secondCalStartDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth() + 1,
    1
  );
  calendarOneHeading: string | undefined | null;
  calendarTwoHeading: string | undefined | null;
  dateRangeSelectionType: 'exact' | '+1' | '+2' | '+3' | '+7' = 'exact';

  onChangeMonth(type: string) {
    var className =
      type === 'next'
        ? 'mat-calendar-next-button'
        : 'mat-calendar-previous-button';
    var classes = document.getElementsByClassName(className);
    var e1 = classes[0] as HTMLElement;
    var e2 = classes[1] as HTMLElement;
    e1.click();
    e2.click();
    this.updateHeaderText();
  }

  updateHeaderText() {
    setTimeout(() => {
      var cl = document.getElementsByClassName('mat-calendar-period-button');
      this.calendarOneHeading = cl[0]?.children[0]?.children[0]?.textContent;
      this.calendarTwoHeading = cl[1]?.children[0]?.children[0]?.textContent;
    }, 0);
  }

  selectedChange(m: any) {
    this.isCurrentCalendarInputCheckout = false;
    if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
      if (this.dateRangeSelectionType != 'exact') {
        let incDays = parseInt(this.dateRangeSelectionType);
        this.selectedRangeValue = new DateRange<Date>(
          m,
          this.addDays(m, incDays)
        );
        this.updateDateSelection('checkin', m);
        this.updateDateSelection('checkout', this.addDays(m, incDays));
        this.showDropdown = DropdownType.none;
      } else {
        this.selectedRangeValue = new DateRange<Date>(m, null);
        this.updateDateSelection('checkin', m);
        this.isCurrentCalendarInputCheckout = true;
      }
    } else {
      const start = this.selectedRangeValue.start;
      const end = m;
      if (end < start) {
        this.selectedRangeValue = new DateRange<Date>(end, start);
        this.updateDateSelection('checkin', end);
        this.updateDateSelection('checkout', start);
      } else {
        this.selectedRangeValue = new DateRange<Date>(start, end);
        this.updateDateSelection('checkin', start);
        this.updateDateSelection('checkout', end);
      }
      this.showDropdown = DropdownType.none;
    }
    // if (!this.selectedRangeValue?.end) {
    //   this.updateDateSelection('checkin', m);
    // } else {
    // }
    this.selectedRangeValueChange.emit(this.selectedRangeValue);
  }

  updateDateSelection(type: string, event: any) {
    let date = moment(event).format('DD/MM/YYYY');
    if (type === 'checkin') {
      this.searchForm.controls.checkIn.setValue(date);
      this.searchForm.controls.checkOut.setValue(null);
    } else if (type === 'checkout') {
      this.searchForm.controls.checkOut.setValue(date);
    }
  }

  setDateRangeSelectionType(val: 'exact' | '+1' | '+2' | '+3' | '+7') {
    this.dateRangeSelectionType = val;
  }

  addDays(date: string | number | Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
