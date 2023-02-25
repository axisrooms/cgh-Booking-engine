import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  @Input() room: any;
  @Input() id: number | any;
  @Input() property: any;
  @Output() btnEvent = new EventEmitter<any>();

  constructor(
    private searchService: SearchService,

  ) { }

  ngOnInit(): void {
    console.log(this.room, this.property)

  }

  onBookNow() {
    this.btnEvent.emit('button clicked');
  }
}
