import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  private apiUrl = 'http://localhost:5000/api/artists';

  constructor(private http: HttpClient) { }

  getArtists(): Observable<artist[]> {
    return this.http.get<artist[]>(this.apiUrl);
  }

  addArtist(newArtist: artist): Observable<artist> {
    return this.http.post<artist>(this.apiUrl, newArtist);
  }


}
