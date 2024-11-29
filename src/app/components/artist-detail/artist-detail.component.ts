import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ArtistsService } from '../../services/artists.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CreateArtistComponent } from '../../modals/create-artist/create-artist.component';
import { MatDialog } from '@angular/material/dialog';
import { artist } from '../../models/artist.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface Tile {
  color: string;
  imageUrl?: string;
  buttonText?: string;
  cols: number;
  rows: number;
  text: string;
  type: 'header' |'text' | 'image' | 'button' | 'info';
}

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [ 
    MatGridListModule,
    CommonModule, 
    MatButtonModule, 
    MatIcon,
    MatCardModule,
    MatListModule,
],
  templateUrl: './artist-detail.component.html',
  styleUrl: './artist-detail.component.scss'
})
export class ArtistDetailComponent implements OnInit {
  artistId!: number;
  artistName: string = '';
  artistEmail: string = '';
  artistWebPage?: string = '';
  artistContact: string = '';
  artistPhone: string = '';
  tiles: Tile[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private artistsService: ArtistsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.artistId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArtistDetails(this.artistId);
  }

  loadArtistDetails(id: number): void {
    this.artistsService.getArtistById(id).subscribe({
      next: (artist) => {
        this.artistName = artist.artistName;
        this.artistEmail = artist.email;
        this.artistWebPage = artist.webPage;
        this.artistContact = artist.contact;
        this.artistPhone = artist.phone;
        const imageUrl = artist.photo
          ? `http://localhost:5000/uploads/${artist.photo}` // Use the photo field from the artist object
          : 'https://via.placeholder.com/300'; // Fallback to placeholder if no photo is available
  
        this.tiles = [
          { text: 'Image', imageUrl, cols: 2, rows: 1, color: '', type: 'image' },
          { text: this.artistName, cols: 2, rows: 1, color: '', type: 'header' },
          { text: 'Eventos', cols: 2, rows: 3, color: '', type: 'text' },
          { text: 'Buttons', cols: 1, rows: 2, color: '', type: 'button' },
          { text: 'Info', cols: 3, rows: 2, color: '', type: 'info' },
        ];
      },
      error: (error) => {
        console.error('Failed to load artist details:', error);
      },
    });
  }
  
  // loadArtistDetails(id: number): void {
  //   this.artistsService.getArtistById(id).subscribe((artist) => {

  //     this.artistName = artist.artistName;
  //     this.artistEmail = artist.email;
  //     this.artistWebPage = artist.webPage;
  //     this.ArtistContact = artist.contact;
  //     this.artistPhone = artist.phone;
  //     const imageUrl = artist.photo
  //     ? `http://localhost:5000/uploads/${artist.photo}` // Use the photo field from the artist object
  //     : 'https://via.placeholder.com/300'; // Fallback to placeholder if no photo is available

  //     this.tiles= [
  //       {text: 'Image', imageUrl, cols: 2, rows: 1, color: '', type: 'image'},
  //       {text: this.artistName, cols: 2, rows: 1, color: '', type: 'header'},
  //       {text: 'Eventos', cols: 2, rows: 3, color: '', type: 'text'},
  //       {text: 'Buttons', cols: 1, rows: 2, color: '', type: 'button'},
  //       {text: 'Info', cols: 3, rows: 2, color: '', type: 'info'},
  //     ];
  //   });
  // }

  onPushPhoto(): void {
    alert('Push Photo');
  }

  // editArtist(id: number): void {
  //   this.artistsService.editArtist(id, new FormData).subscribe((updatedArtist) => {
  //     console.log('Artist updated successfully:', updatedArtist);
  //     this.loadArtistDetails(this.artistId);
  //   });
  // }

  editArtist(id: number, artist: artist): void {
    console.log('Artist object:', artist);

    const formData = new FormData();
    formData.append('artistName', artist.artistName);
    formData.append('email', artist.email);
    formData.append('webPage', artist.webPage ?? '');
    formData.append('contact', artist.contact);
    formData.append('phone', artist.phone);

    if (artist.photo && typeof artist.photo !== 'string') {
      formData.append('photo', artist.photo); 
    }
  
    this.artistsService.editArtist(id, formData).subscribe({
      next: (updatedArtist) => {
        console.log('Artist updated successfully:', updatedArtist);
        this.loadArtistDetails(this.artistId); // Refresh artist details
      },
      error: (error) => {
        console.error('Error updating artist:', error);
      },
    });
  }
  // openEditArtistModal(artist: artist): void {
  //   console.log('Opening edit modal with artist:', artist);
  
  //   const dialogRef = this.dialog.open(CreateArtistComponent, {
  //     width: '500px',
  //     data: { artist }, // Pass the artist data to the modal
  //   });
  
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result?.action === 'edit') {
  //       console.log('Result from modal:', result.artist);     
  //     }
  //   });
  // }


  openEditArtistModal(): void {
    const artist = this.getArtistForEdit();
    console.log('Opening edit modal with artist:', artist);
  
    const dialogRef = this.dialog.open(CreateArtistComponent, {
      width: '500px',
      data: { artist }, // Pass artist data to the modal
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit' || result?.action === 'create') {
        // Reload the artist details if changes were made
        console.log('Artist updated:', result.artist);
        this.loadArtistDetails(this.artistId); 
      }
      console.log('Modal result:', result);
    });
  }
  

  private prepareFormData(artist: artist): FormData {
    const formData = new FormData();
    formData.append('artistName', artist.artistName || '');
    formData.append('email', artist.email || '');
    formData.append('webPage', artist.webPage || '');
    formData.append('contact', artist.contact || '');
    formData.append('phone', artist.phone || '');
    if (artist.photo && typeof artist.photo !== 'string') {
      formData.append('photo', artist.photo); // Only add the photo if it's a file
    }
  //  console.log('Prepared FormData:', Array.from(formData.entries()));
    return formData;
  }
  
  

  getArtistForEdit(): artist {
    const imageTile = this.tiles.find(tile => tile.type === 'image');
    const photo = imageTile?.imageUrl?.replace('http://localhost:5000/uploads/', '');
  
    return {
      id: this.artistId,
      artistName: this.artistName,
      email: this.artistEmail,
      webPage: this.artistWebPage,
      contact: this.artistContact,
      phone: this.artistPhone,
      photo: photo || null // Optional photo field
    };
  }
  
  
  onDeleteArtist(): void {
    alert('Delete Artist');
  }
}
