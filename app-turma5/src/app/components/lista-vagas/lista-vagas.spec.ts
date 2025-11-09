import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVagas } from './lista-vagas';

describe('ListaVagas', () => {
  let component: ListaVagas;
  let fixture: ComponentFixture<ListaVagas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaVagas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaVagas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
