import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-page-scroll-top',
  imports: [],
  templateUrl: './page-scroll-top.html',
  styleUrl: './page-scroll-top.css',
})
export class PageScrollTop {
  // Class properties
  isVisible: boolean = false;

  // Decorator that declares a DOM event to listen for
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Displays the button as soon as the user scrolls down the page
    this.isVisible = window.scrollY > 0;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth animation
    });
  }
}
