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
  public Common = Common;
  public Status = Status;

  @Input() order: any;
}
