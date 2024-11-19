import { Component } from '@angular/core';
import  { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, 
    MatSidenavModule, 
    CommonModule, 
    SidebarComponent,
    MatSidenavModule,
    DashboardComponent,
    RouterOutlet, 
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isSidenavOpen = true;

}
