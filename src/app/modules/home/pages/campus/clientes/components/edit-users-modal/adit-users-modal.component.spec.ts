import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsersModalComponent } from './edit-users-modal.component';

describe('AddUsersModalComponent', () => {
  let component: EditUsersModalComponent;
  let fixture: ComponentFixture<EditUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUsersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
