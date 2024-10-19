import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';

describe('TableComponent', () => {
  let component: TableComponent<string>;
  let fixture: ComponentFixture<TableComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent<TableComponent<string>>(TableComponent);
    component = fixture.componentInstance;

    component.columns = ['id', 'name'];
    component.data = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    component.showActions = true;
    component.itemsPerPage = 6;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
