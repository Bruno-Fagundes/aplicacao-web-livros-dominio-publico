import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements AfterViewInit {
  title = 'Literatura Pública';

  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;
  headerHeightReady = false;

  ngAfterViewInit() {
    const height = this.headerEl.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${height}px`);
    this.headerHeightReady = true;
  }
}

