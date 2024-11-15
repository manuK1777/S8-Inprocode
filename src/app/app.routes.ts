import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { FullCalendarComponent } from './components/full-calendar/full-calendar.component';
import { GraficsComponent } from './components/grafics/grafics.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '', component: HomeComponent, children: [
        { path: 'mapa', component: MapaComponent },
        { path: 'grafics', component: GraficsComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'artistList', component: ArtistListComponent },
        { path: 'calendario', component: FullCalendarComponent },
      ] },

// export const routes: Routes = [
//     {
//       path: '',
//       component: HomeComponent,
//       children: [
//         { path: '', component: DashboardComponent }, // Default route (dashboard)
//         { path: 'artistList', component: ArtistListComponent },
//         { path: 'calendar', component: FullCalendarComponent },
//         // Add more routes here as needed
//       ]
//     },
//     { path: '**', redirectTo: '' }
//   ];


    // { path: 'home', component: HomeComponent },
    // { path: 'mapa', component: MapaComponent },
    // { path: 'calendario', component: FullCalendarComponent },
    // { path: 'grafics', component: GraficsComponent },
    // { path: 'artistList', component: ArtistListComponent },
    // { path: 'dashboard', component: DashboardComponent },
    
];
