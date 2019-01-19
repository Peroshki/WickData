import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { mergeMap } from 'rxjs/operators';

// Global variable to hold the candlestick chart via the Plotly module.
declare var Plotly: any;

@Component({
  selector: 'app-single-day-weather',
  templateUrl: './single-day-weather.component.html',
  styleUrls: ['./single-day-weather.component.scss']
})
export class SingleDayWeatherComponent implements OnInit {

  // ngModel variables for input fields
  cityName: string;
  datePicked: Date;

  // Strings which contain formatted city names and dates
  weatherDate: string;
  elementDate: string;

  // Variables and arrays which contain formatted wick data
  weatherData: any;
  temps: number[];

  openTemp: number;
  closeTemp: number;
  minTemp: number;
  maxTemp: number;

  hasData: boolean = true;
  graphExists: boolean;

  constructor(private data: DataService) { }

  ngOnInit() { }

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
    console.log(this.temps);

    // Check if there is any weather data for the given input
    // If no data exists, exit the function
    this.hasData = Boolean(this.temps.length != 0);

    if (this.hasData == false) {
      this.graphExists = false;
      return;
    }

    // In the data provided from the Metaweather API,
    // the closing temp is always the first temp in the array and the opening temp is always the last
    this.closeTemp = this.temps[0];
    this.openTemp = this.temps[this.temps.length - 1];

    // Find the minimum and maximum temps for the day
    this.minTemp = 100;
    this.maxTemp = 0;

    this.temps.forEach(element => {
      if (element < this.minTemp) {
        this.minTemp = element;
      }
      if (element > this.maxTemp) {
        this.maxTemp = element;
      }
    });

    // Make the graph using the Plotly command and style it appropriately
    let data = [{
      x: [this.elementDate],

      close: [this.closeTemp],

      decreasing: { line: { color: '#8B0000' } },

      high: [this.maxTemp],

      increasing: { line: { color: '#228B22' } },

      low: [this.minTemp],

      open: [this.openTemp],

      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y'
    }];

    let layout = {
      dragmode: 'zoom',
      showlegend: false,
      title: 'Weather data for ' + this.titleCase(this.cityName) + ' on ' + this.weatherData[0].applicable_date,

      modebar: {
        orientation: "v"
      },

      margin: {
        r: 10,
        t: 40,
        b: 40,
        l: 60
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

  // Searches and formats wick data based on user input
  searchClicked() {
    // Reset the array which stores the wick data
    this.temps = [];

    // Format the strings for the weather dates
    // If the date is invalid, exit the function
    if (this.datePicked.toString() == 'Invalid Date') {
      return;
    } else {
      this.formatDates();
    }

    // Loop through each element in the JSON array and grab the weather data for the specified date
    this.data.getWOEID(this.cityName).pipe(
      mergeMap(newData => this.data.getTodaysWeatherData(newData[0].woeid, this.weatherDate))

    ).subscribe(data => {
      this.weatherData = data;
      console.log(this.weatherData);

      this.weatherData.forEach(element => {
        if (element.created.includes(this.elementDate)) {
          this.temps.push(element.the_temp);
        }
      })

      // Make the graph
      this.makeGraph();
    });
  }
}
