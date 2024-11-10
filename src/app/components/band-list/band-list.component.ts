import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-band-list',
  standalone: true,
  imports: [ MatButton],
  templateUrl: './band-list.component.html',
  styleUrl: './band-list.component.scss'
})
export class BandListComponent {

}
