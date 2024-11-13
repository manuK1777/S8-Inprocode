import { FormControl } from '@angular/forms';

export interface ArtistForm {
  artistName: FormControl<string | null>;
  email: FormControl<string | null>;
  webPage: FormControl<string | null>;
  contact: FormControl<string | null>;
  phone: FormControl<string | null>;
}


// export interface artist {
//     bandName: string;
//     email: string;
//     webPage?: string;
//     contact: string;
//     phone: string;
//   }
  
