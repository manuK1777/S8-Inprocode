import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { ArtistsService } from '../../services/artists.service';


@Component({
  selector: 'app-edit-artist-info',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './edit-artist-info.component.html',
  styleUrl: './edit-artist-info.component.scss'
})
export class EditArtistInfoComponent {

}
