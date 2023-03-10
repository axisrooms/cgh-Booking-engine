import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  @Input() room: any;
  @Input() property: any;
  @Output() btnEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onBookNow() {
    this.btnEvent.emit('button clicked');
  }
}
