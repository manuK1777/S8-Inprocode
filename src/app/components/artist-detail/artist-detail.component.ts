import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ArtistsService } from '../../services/artists.service';

export interface Tile {
  color: string;
  imageUrl?: string;
  buttonText?: string;
  cols: number;
  rows: number;
  text: string;
  type: 'header' |'text' | 'image' | 'button';
}

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [ 
    MatGridListModule,
    CommonModule, 
    MatButtonModule, 
    MatIcon,
],
  templateUrl: './artist-detail.component.html',
  styleUrl: './artist-detail.component.scss'
})
export class ArtistDetailComponent implements OnInit {
  artistId!: number;
  artistName: string = '';
  tiles: Tile[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private artistsService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.artistId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArtistDetails(this.artistId);
  }

  loadArtistDetails(id: number): void {
    this.artistsService.getArtistById(id).subscribe((artist) => {
      this.artistName = artist.artistName;

      const imageUrl = artist.photo
      ? `http://localhost:5000/uploads/${artist.photo}` // Use the photo field from the artist object
      : 'https://via.placeholder.com/300'; // Fallback to placeholder if no photo is available

      this.tiles= [
        {text: 'Image', imageUrl, cols: 2, rows: 1, color: '', type: 'image'},
        {text: this.artistName, cols: 2, rows: 1, color: '', type: 'header'},
        {text: 'Eventos', cols: 2, rows: 3, color: '', type: 'text'},
        {text: 'Buttons', cols: 1, rows: 2, color: '', type: 'button'},
        {text: 'map', cols: 3, rows: 2, color: '', type: 'text'},
      ];
    });
  }

  onButtonClick(tile: Tile): void {
    alert(`Button clicked in tile: ${tile.text || tile.buttonText}`);
  }

  onPushPhoto(): void {
    alert('Push Photo');
  }

  onEditInfo(): void {
    alert('Edit Info');
  }

  onDeleteArtist(): void {
    alert('Delete Artist');
  }
}
