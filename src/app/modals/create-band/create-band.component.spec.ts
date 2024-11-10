import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBandComponent } from './create-band.component';

describe('CreateBandComponent', () => {
  let component: CreateBandComponent;
  let fixture: ComponentFixture<CreateBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
