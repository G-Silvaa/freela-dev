import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAcademicoComponent } from './email-academico.component';

describe('EmailAcademicoComponent', () => {
  let component: EmailAcademicoComponent;
  let fixture: ComponentFixture<EmailAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailAcademicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
