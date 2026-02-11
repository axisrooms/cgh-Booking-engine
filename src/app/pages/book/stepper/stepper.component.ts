import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StepperType } from '../book.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
})
export class StepperComponent implements OnInit {
  eStepper = StepperType;
  @Input() stepper: StepperType = this.eStepper.personalDetails;
  bookingEngineId: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookingEngineId = params['bookingEngineId'] || '';
    });
  }

  navigateTo(step: string): void {
    const basePath = this.bookingEngineId ? `/book/${step}/${this.bookingEngineId}` : `/book/${step}`;
    this.router.navigate([basePath]);
  }

  navigateToSearch(): void {
    const path = this.bookingEngineId ? `/search/${this.bookingEngineId}` : '/search';
    this.router.navigate([path]);
  }

  isStepClickable(targetStep: StepperType): boolean {
    // Can only click on previous/current steps, not future ones
    return targetStep <= this.stepper;
  }
}
