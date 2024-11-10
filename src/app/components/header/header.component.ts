import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterModule, 
    MatTabsModule, 
    MatSidenavModule,
  MatListModule,
  MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
}
