import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { mergeMap } from 'rxjs/operators';

// Global variable to hold the candlestick chart via the Plotly module.
declare var Plotly: any;

@Component({
  selector: 'app-one-month-weather',
  templateUrl: './one-month-weather.component.html',
  styleUrls: ['./one-month-weather.component.scss']
})
export class OneMonthWeatherComponent implements OnInit {

  // ngModel variables for input fields
  cityName: string;
  datePicked: Date;

  // Strings which contain formatted city names and dates
  weatherDate: string;
  elementDate: string;
  newQuery: string;

  // Variables and arrays which contain formatted wick data
  weatherData: any;
  dayTemps: number[];
  dates: string[];

  openTemp: number;
  closeTemp: number;
  minTemp: number;
  maxTemp: number;

  openTemps: number[];
  closeTemps: number[];
  minTemps: number[];
  maxTemps: number[];

  hasData: boolean = true;
  graphExists: boolean;
  dateCounter: number;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getAirlineData().subscribe(data => {
      console.log(data);
    })
  }

  // TitleCases a string using the Array.prototype.map() and String.prototype.replace() methods
  titleCase(str) {
    str = str.toLowerCase()   // Step 1: Lowercase the string
      .split(' ')             // Step 2: Split the string into an array of words
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      });                     // Step 3: Map over the array, uppercasing the first letter of each word

    return str.join(' ');     // Step 4: Return the output
  }

  // Formats the strings associated with the dates in order to make correct API calls
  formatDates() {
    if (this.datePicked.getMonth() < 9) {
      this.weatherDate = this.datePicked.toDateString().substr(11, 4)
        + '/0' + (this.datePicked.getMonth() + 1).toString()
        + '/' + this.datePicked.toDateString().substr(8, 2);
    } else {
      this.weatherDate = this.datePicked.toDateString().substr(11, 4)
        + '/' + (this.datePicked.getMonth() + 1).toString()
        + '/' + this.datePicked.toDateString().substr(8, 2);
    }
    this.elementDate = this.weatherDate.replace(new RegExp('/', 'g'), '-');
  }

  // Creates the candlestick chart for todays weather using the data provided in searchCity()
  makeGraph() {
    console.log(this.dates);
    // Check if there is any weather data for the given input
    // If no data exists, exit the function
    this.hasData = Boolean(this.dates.includes(this.elementDate));

    if (this.hasData == false) {
      this.graphExists = false;
      return;
    }

    for(var i = 0; i < this.minTemps.length; i++) {
      var tempMin = this.minTemps[i];
      var tempMax = this.maxTemps[i];
      var tempOpen = this.openTemps[i];
      var tempClose = this.closeTemps[i];

      if(tempOpen < tempClose) {
        if(tempMax < tempClose) {
          this.maxTemps[i] = tempClose * 1.05;
        }
      } else if(tempClose < tempOpen) {
        if(tempMin > tempClose) {
          this.minTemps[i] = tempClose * 0.95
        }
      }
      console.log(tempMax);
    }

    // Make the graph using the Plotly command and style it appropriately
    let data = [{
      x: this.dates,

      close: this.closeTemps,

      decreasing: { line: { color: '#8B0000' } },

      high: this.maxTemps,

      increasing: { line: { color: '#228B22' } },

      low: this.minTemps,

      open: this.openTemps,

      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y'
    }];

    let layout = {
      dragmode: 'zoom',
      showlegend: false,
      title: 'Weather data for ' + this.titleCase(this.cityName) + ' from ' + this.datePicked.toDateString().substr(11, 4)
      + '-' + (this.datePicked.getMonth() + 1).toString()
      + '-' + this.datePicked.toDateString().substr(8, 2) + ' to ' + this.newQuery.replace(new RegExp('/', 'g'), '-'),

      modebar: {
        orientation: "v"
      },

      margin: {
        r: 100,
        t: 40,
        b: 40,
        l: 100
      },

      xaxis: {
        autorange: true,
        domain: [0, 1],
        type: 'date',
        rangeslider: {
          visible: false
        }
      },

      yaxis: {
        autorange: true,
        domain: [0, 1],
        title: 'Degrees Celcius',
        type: 'linear'
      }
    };

    Plotly.newPlot('graphDiv', data, layout, { responsive: true });
    this.graphExists = true;
  }

  formatData(date: string) {
    if(this.dateCounter >= 32) {
      // Make the graph
      this.makeGraph();
      return;
    }
    // Loop through each element in the JSON array and grab the weather data for the specified date
    this.data.getWOEID(this.cityName).pipe(
      mergeMap(newData => this.data.getTodaysWeatherData(newData[0].woeid, date))

    ).subscribe(data => {
      let count = 0;
      this.weatherData = data;

      this.maxTemps[this.dateCounter - 1] = 0;
      this.minTemps[this.dateCounter - 1] = 100;

      let closeTempSet = false;
      let currentDate = this.weatherData[0].created.substr(0, 10);
      
      this.weatherData.forEach(element => {
        let newDate = element.created.substr(0, 10);

        if(newDate != currentDate) {
          this.openTemps.push(this.dayTemps.pop());
          this.dayTemps = [];

          if(count > 7) {
            
          } else {
            this.dates.push(currentDate);
            this.maxTemps[this.dateCounter] = 0;
            this.minTemps[this.dateCounter] = 100;
          }

          currentDate = newDate;
          this.dateCounter++;
          count++;

          closeTempSet = false;
        }

        if(closeTempSet == false) {
          if(this.closeTemps.includes(element.the_temp)){
            return;
          }
          this.closeTemps.push(element.the_temp);
          closeTempSet = true;
        }

        if(count == 8) {
          this.newQuery = element.created.substr(0, 10).replace(new RegExp('-', 'g'), '/');
        } else if(count > 7) {
          return;
        } else {
          if(element.the_temp < this.minTemps[this.dateCounter - 1]) {
            this.minTemps[this.dateCounter - 1] = element.the_temp;
          }
  
          if(element.the_temp > this.maxTemps[this.dateCounter - 1]) {
            this.maxTemps[this.dateCounter - 1] = element.the_temp;
          }

          this.dayTemps.push(element.the_temp);
        }
      })

      // while(this.closeTemps.length > 7) {
      //   this.closeTemps.pop();
      // }

      // while(this.openTemps.length > 7) {
      //   this.openTemps.pop();
      // }

      // while(this.maxTemps.length > 7) {
      //   this.maxTemps.pop();
      // }

      // while(this.minTemps.length > 7) {
      //   this.minTemps.pop();
      // }

      this.formatData(this.newQuery);
    });
  }

  // Searches and formats wick data based on user input
  searchClicked() {
    // Reset the Map which stores the wick data
    this.dates = [];
    this.dayTemps = [];

    this.openTemps = [];
    this.closeTemps = [];
    this.maxTemps = [];
    this.minTemps = [];

    // Format the strings for the weather dates
    // If the date is invalid, exit the function
    if (this.datePicked.toString() == 'Invalid Date') {
      return;
    } else {
      this.formatDates();
    }

    this.dateCounter = 1;

    this.formatData(this.weatherDate);
  }
}
