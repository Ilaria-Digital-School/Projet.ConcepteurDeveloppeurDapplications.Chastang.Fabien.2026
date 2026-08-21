import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Common } from '../../constants/common';
import { Status } from '../../constants/status';

@Component({
  selector: 'app-user-order',
  imports: [DatePipe],
  templateUrl: './user-order.html',
  styleUrl: './user-order.css',
})
export class UserOrder {
  // Constants
  public Common = Common;
  public Status = Status;

  // To retrieve data from another component
  @Input() order: any;
}
