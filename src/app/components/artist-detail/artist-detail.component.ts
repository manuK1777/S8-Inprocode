import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [],
  templateUrl: './artist-detail.component.html',
  styleUrl: './artist-detail.component.scss'
})
export class ArtistDetailComponent implements OnInit {
  artistId!: number;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.artistId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArtistDetails(this.artistId);
  }

  loadArtistDetails(id: number): void {
    // Fetch artist details based on the ID
    console.log('Artist ID:', id);
  }
}
