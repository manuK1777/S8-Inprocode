import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { ArtistsService } from '../../services/artists.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { artist } from '../../models/artist.model';

@Component({
  selector: 'app-create-artist',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule, 
    MatDialogModule
  ],
  templateUrl: './create-artist.component.html',
  styleUrl: './create-artist.component.scss'
})
export class CreateArtistComponent implements OnInit {
  artistForm!: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  selectedFile: File | null = null; 
  previewUrl: string | ArrayBuffer | null = null; 

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateArtistComponent>,
    private http: HttpClient,
    private artistsService: ArtistsService,
    @Inject(MAT_DIALOG_DATA) public data: { artist?: artist }
  ) {}

 

  ngOnInit(): void {
    const artist: Partial<artist> = this.data?.artist || {};
  
    // Initialize form with existing artist data or empty values
    this.artistForm = this.fb.group({
      artistName: [artist.artistName || '', [Validators.required, Validators.minLength(2)]],
      email: [artist.email || '', [Validators.required, Validators.email]],
      webPage: [artist.webPage || '', [Validators.pattern(/^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/)]],
      contact: [artist.contact || '', [Validators.required, Validators.minLength(2)]],
      phone: [artist.phone || '', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    });
  
    // Reset file and preview if editing
    if (artist?.photo) {
      this.previewUrl = `/uploads/${artist.photo}`;
      this.selectedFile = null;
    } else {
      this.previewUrl = null;
      this.selectedFile = null;
    }
  }
  

   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onFileDropped(event: Event): void {
    const dragEvent = event as DragEvent; 
    dragEvent.preventDefault(); 
    if (dragEvent.dataTransfer && dragEvent.dataTransfer.files.length > 0) {
      this.processFile(dragEvent.dataTransfer.files[0]);
    }
  }

  private processFile(file: File): void {
    // Validate file size (10 KB - 5 MB)
    if (file.size < 10 * 1024 || file.size > 5 * 1024 * 1024) {
      alert('File size must be between 10 KB and 5 MB.');
      return;
    }

    // Validate file type (JPG or PNG)
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Invalid file type. Please upload a JPG or PNG image.');
      return;
    }

    this.selectedFile = file;

    // Generate a preview for the image
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSave(): void {
    if (this.artistForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formData = new FormData();
      formData.append('artistName', this.artistForm.get('artistName')?.value);
      formData.append('email', this.artistForm.get('email')?.value);
      formData.append('webPage', this.artistForm.get('webPage')?.value || '');
      formData.append('contact', this.artistForm.get('contact')?.value);
      formData.append('phone', this.artistForm.get('phone')?.value);

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      console.log('FormData before submission:', Array.from((formData as any).entries()));

       // Check if editing or creating
    if (this.data?.artist) {
      console.log('Editing Artist ID:', this.data.artist.id);

      // Editing existing artist
      this.artistsService.editArtist(this.data.artist.id, formData).subscribe({
        next: (response) => {
          this.dialogRef.close({ action: 'edit', artist: response });
        },
        error: (error) => {
          console.error('Error updating artist:', error);
          this.errorMessage = error.error?.message || 'Failed to update artist';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Creating new artist
      this.artistsService.addArtistWithPhoto(formData).subscribe({
        next: (response) => {
          console.log('Artist created successfully:', response);
          this.dialogRef.close({ action: 'create', artist: response });
        },
        error: (error) => {
          console.error('Error creating artist:', error);
          this.errorMessage = error.error?.message || 'Failed to create artist';
          this.isSubmitting = false;
        },
      /**
       * Reset the isSubmitting flag when the request is complete.
       */
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  } else {
    this.markFormGroupTouched(this.artistForm);
  }
  }


  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // loadArtists(): void {
  //   this.artistsService.getArtists().subscribe({
  //     next: (data: artist[]) => {
  //       this.dataSource.data = data;
  //     },
  //     error: (error) => {
  //       console.error('Failed to fetch artists', error);
  //     },
  //   });
  // }
}