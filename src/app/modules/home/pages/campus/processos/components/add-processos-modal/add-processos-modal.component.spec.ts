import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprocessosModalComponent } from './add-processos-modal.component';

describe('AddUsersModalComponent', () => {
  let component: AddprocessosModalComponent;
  let fixture: ComponentFixture<AddprocessosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddprocessosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddprocessosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
