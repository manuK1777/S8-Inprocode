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
import { ConfirmationDialogComponent } from '../../modals/confirmation-dialog/confirmation-dialog.component';
import { artist } from '../../models/artist.model';
import { MatSnackBar} from '@angular/material/snack-bar';

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
  selectedFile: File | null = null; 

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private artistsService: ArtistsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
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
          ? `http://localhost:5000/uploads/${artist.photo}` 
          : 'http://localhost:5000/uploads/tortuga.jpg';
  
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
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    // Validate file size (10 KB - 5 MB)
    if (file.size < 10 * 1024 || file.size > 5 * 1024 * 1024) {
      alert('File size must be between 10 KB and 5 MB.');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG or WEBP image.');
      return;
    }

    this.selectedFile = file;

    // Send the file to the server
    const formData = new FormData();
    formData.append('photo', file);

    this.artistsService.updateArtistPhoto(this.artistId, file).subscribe({
      next: () => {
        this.loadArtistDetails(this.artistId);
      },
      error: (error) => {
        console.error('Failed to upload photo:', error);
      },
    });
  }

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
        this.loadArtistDetails(this.artistId); 
      },
      error: (error) => {
        console.error('Error updating artist:', error);
      },
    });
  }
 
  openEditArtistModal(): void {
    const artist = this.getArtistForEdit();
    console.log('Opening edit modal with artist:', artist);

    const dialogRef = this.dialog.open(CreateArtistComponent, {
      width: '500px',
      data: { artist }, 
  
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit' || result?.action === 'create') {
        console.log('Artist updated:', result.artist);
        this.loadArtistDetails(this.artistId); 
      }
      console.log('Modal result:', result);
    });
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
      photo: photo || null 
    };
  }
  
deleteArtist(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que desea eliminar a este artista?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    },
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.artistsService.deleteArtist(this.artistId).subscribe({
        next: () => {
          this.router.navigate(['/artistList']);
          this.snackBar.open('Artista elmininado!', 'Cerrar', {
            duration: 3000, 
            verticalPosition: 'top', 
            horizontalPosition: 'center',
          });
        },
        error: (error) => {
          console.error('Error deleting artist:', error);
          this.snackBar.open('No se pudo eliminar el artista. Por favor, inténtelo de nuevo.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-bar-error'], 
          });
        },
      });
    }
  });
}

}
