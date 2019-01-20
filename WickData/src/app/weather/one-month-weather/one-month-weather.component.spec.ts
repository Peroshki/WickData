import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneMonthWeatherComponent } from './one-month-weather.component';

describe('OneMonthWeatherComponent', () => {
  let component: OneMonthWeatherComponent;
  let fixture: ComponentFixture<OneMonthWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneMonthWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneMonthWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
