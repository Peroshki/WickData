import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getWOEID(cityName: string) {
    return this.http.get('https://www.metaweather.com/api/location/search/?query=' + cityName)
  }

  getTodaysWeatherData(woeid: number, date: string) {
    return this.http.get('https://www.metaweather.com/api/location/' + woeid + '/' + date)
  }

  getAirlineData() {
    return this.http.get('./assets/data.json')
  }
}