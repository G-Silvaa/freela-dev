import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessosComponent } from './processos.component';

describe('CursosComponent', () => {
  let component: ProcessosComponent;
  let fixture: ComponentFixture<ProcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
