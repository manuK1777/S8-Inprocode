import { AfterViewInit, Component, ViewChild, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OpenModalCreateArtistService } from '../../services/open-modal-create-artist.service';
import { HttpClient } from '@angular/common/http';
import { ArtistsService } from '../../services/artists.service';
import { artist } from '../../models/artist.model';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [ MatButton, MatTableModule, MatPaginatorModule, RouterLink ],
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss'
})
export class ArtistListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'artistName', 'email', 'webPage', 'contact', 'phone'];
  dataSource = new MatTableDataSource<artist>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private openModalCreateArtistService: OpenModalCreateArtistService,
    private http: HttpClient,
    private artistsService: ArtistsService,  
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArtists();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadArtists(): void {
    this.artistsService.getArtists().subscribe({
      next: (data: artist[]) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Failed to fetch artists', error);
      },
    });
  }

  openModalCreateArtist() {
    const dialogRef = this.openModalCreateArtistService.openCreateArtistModal();

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        this.loadArtists();
      }
    });
  }

  onSelectArtist(artist: artist) {
    const artistSlug = artist.artistName.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/artist', artist.id, artistSlug]);
  }

  sanitizeWebPage(url: string | null): string {
    if (!url) {
      return '#'; 
    }
    return url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
  }
  

}
