import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionModalComponent } from './concession-modal.component';

describe('ConcessionModalComponent', () => {
  let component: ConcessionModalComponent;
  let fixture: ComponentFixture<ConcessionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcessionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
