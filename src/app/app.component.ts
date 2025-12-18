import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BOOKING_ENGINE_ID } from './shared/constants/url.constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Booking Engine V5';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Listen to all navigation events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation completed to:', event.url);
      
      const urlTree = this.router.parseUrl(event.url);
      const path = urlTree.root.children['primary']?.segments.map(s => s.path).join('/') || '';
      const queryParams = urlTree.queryParams;
      
      console.log('Current path:', path);
      console.log('Current query params:', queryParams);
      
      // Only add default bookingEngineId if we're on search page without one
      if (path === 'search' && !queryParams['bookingEngineId']) {
        console.log('Adding default bookingEngineId:', BOOKING_ENGINE_ID);
        // Use navigate to preserve history but add the query param
        this.router.navigate(['/search'], { 
          queryParams: { bookingEngineId: BOOKING_ENGINE_ID.toString() },
          queryParamsHandling: 'merge'
        });
      }
    });
  }
}
