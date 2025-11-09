import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gestores } from './gestores';

describe('Gestores', () => {
  let component: Gestores;
  let fixture: ComponentFixture<Gestores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gestores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gestores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
