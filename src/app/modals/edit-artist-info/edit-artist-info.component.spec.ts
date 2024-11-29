import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArtistInfoComponent } from './edit-artist-info.component';

describe('EditArtistInfoComponent', () => {
  let component: EditArtistInfoComponent;
  let fixture: ComponentFixture<EditArtistInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditArtistInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditArtistInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
