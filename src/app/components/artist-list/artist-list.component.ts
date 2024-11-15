import { AfterViewInit, Component, ViewChild, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { OpenModalCreateArtistService } from '../../services/open-modal-create-artist.service';
import { HttpClient } from '@angular/common/http';
import { ArtistsService } from '../../services/artists.service';
import { artist } from '../../models/artist.model';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [ MatButton, MatTableModule, MatPaginatorModule ],
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss'
})
export class ArtistListComponent implements AfterViewInit {
//[x: string]: any;

  displayedColumns: string[] = ['id', 'artistName', 'email', 'webPage', 'contact', 'phone'];
  dataSource = new MatTableDataSource<artist>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private openModalCreateArtistService: OpenModalCreateArtistService,
    private http: HttpClient,
    private artistsService: ArtistsService,  
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
      if (result) {
        this.loadArtists();
      }
    });
  }

}