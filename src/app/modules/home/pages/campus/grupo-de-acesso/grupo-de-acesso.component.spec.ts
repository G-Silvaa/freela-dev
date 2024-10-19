import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDeAcessoComponent } from './grupo-de-acesso.component';

describe('GrupoDeAcessoComponent', () => {
  let component: GrupoDeAcessoComponent;
  let fixture: ComponentFixture<GrupoDeAcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoDeAcessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoDeAcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
