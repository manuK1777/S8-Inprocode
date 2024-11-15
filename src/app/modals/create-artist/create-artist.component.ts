import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { artist } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists.service';

@Component({
  selector: 'app-create-artist',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './create-artist.component.html',
  styleUrl: './create-artist.component.scss'
})
export class CreateArtistComponent implements OnInit {
  artistForm!: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateArtistComponent>,
    private http: HttpClient,
    private artistsService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.artistForm = this.fb.group({
      artistName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      webPage: ['', [Validators.pattern(/^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/)]],
      contact: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]]
    });
  }

  onSave(): void {
   
    if (this.artistForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const artistData: artist = this.artistForm.value;

      this.artistsService.addArtist(artistData).subscribe({
        next: (response) => {
          console.log('Artist created successfully:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error details:', error);
          this.errorMessage = error.error?.message || error.error?.error || 'Failed to create artist';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.artistForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}