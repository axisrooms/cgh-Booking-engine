import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  @Input() cart: any;
  @Input() personalDetails: any;

  constructor() { }

  ngOnInit(): void {
  }

}
