import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent2 } from './table.component';
import { CommonModule } from '@angular/common';

describe('TableComponent', () => {
  let component: TableComponent2<string>;
  let fixture: ComponentFixture<TableComponent2<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent2, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent<TableComponent2<string>>(TableComponent2);
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
