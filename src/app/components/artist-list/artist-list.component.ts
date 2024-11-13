import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { OpenModalCreateArtistService } from '../../services/open-modal-create-artist.service';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [ MatButton],
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss'
})
export class ArtistListComponent {

  constructor(private openModalCreateArtistService: OpenModalCreateArtistService) {}

  openModal() {
    const dialogRef = this.openModalCreateArtistService.openCreateArtistModal();

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('artist created:', result);
      }
    });
  }

}
