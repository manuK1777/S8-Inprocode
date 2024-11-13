import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { FullCalendarComponent } from './components/full-calendar/full-calendar.component';
import { GraficsComponent } from './components/grafics/grafics.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'mapa', component: MapaComponent },
    { path: 'calendario', component: FullCalendarComponent },
    { path: 'grafics', component: GraficsComponent },
    { path: 'artistList', component: ArtistListComponent },
    { path: '**', redirectTo: 'home' } 
];
