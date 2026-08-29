import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from './components/page-header/page-header';
import { PageFooter } from './components/page-footer/page-footer';
import { PageScrollTop } from './components/page-scroll-top/page-scroll-top';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageHeader, PageFooter, PageScrollTop],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('myShop-angular');
}
