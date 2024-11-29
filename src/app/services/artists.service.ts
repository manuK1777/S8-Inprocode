import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getArtistById(id: number): Observable<artist> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.get<artist>(url);
}

  addArtist(newArtist: artist): Observable<artist> {
    return this.http.post<artist>(this.apiUrl, newArtist);
  }

  addArtistWithPhoto(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData); 
  }
 
  editArtist(id: number, formData: FormData): Observable<artist> {
    console.log('FormData entries:');
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  
    return this.http.put<artist>(`${this.apiUrl}/${id}`, formData, { headers });
    // return this.http.put<artist>(`${this.apiUrl}/${id}`, formData);   
  }

}
