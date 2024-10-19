import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaoDeAcessoComponent } from './cartao-de-acesso.component';

describe('CartaoDeAcessoComponent', () => {
  let component: CartaoDeAcessoComponent;
  let fixture: ComponentFixture<CartaoDeAcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaoDeAcessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaoDeAcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
