import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDayWeatherComponent } from './single-day-weather.component';

describe('SingleDayWeatherComponent', () => {
  let component: SingleDayWeatherComponent;
  let fixture: ComponentFixture<SingleDayWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDayWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDayWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
