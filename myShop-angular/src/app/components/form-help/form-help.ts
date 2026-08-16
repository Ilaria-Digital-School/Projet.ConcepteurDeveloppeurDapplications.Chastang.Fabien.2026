import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-help',
  imports: [],
  templateUrl: './form-help.html',
  styleUrl: './form-help.css',
})
export class FormHelp {
  // To retrieve DOM elements
  @ViewChild('infoText') infoText!: ElementRef;

  // To retrieve data from another component
  @Input() isSimple: any;
  @Input() helpHTML: any;

  ngAfterViewInit() {
    this.infoText.nativeElement.innerHTML = this.helpHTML;
  }
}
