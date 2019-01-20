import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

declare var Plotly: any;

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

  val: any;
  max: number;
  min: number;
  maxArray: number [] = [];
  minArray: number [] = [];
  years: string [] = [];
  open: number [] = [];
  close: number [] = [];
  hasData: boolean = true;
  graphExists: boolean;

  constructor(private data: DataService) { }

  ngOnInit() {
      this.data.getAirlineData().subscribe(data => {
        this.val = data;
        console.log(this.val);
        this.makeGraph()
      })
   }

  // Creates the candlestick chart for todays weather using the data provided in searchCity()
  makeGraph() {
    this.open
    if (this.hasData == false) {
      this.graphExists = false;
      return;
    }
    let current = this.val[0].Year;
    this.years.push(current);
    this.minArray.push(this.val[0].MinimumforYear);
    this.maxArray.push(this.val[0].MaximumforYear);
    let counter = 1;
    this.val.forEach(element => {
      let year = element.Year;
      let value = element.CurrentAverage;
      let min = element.MinimumforYear;
      let max = element.MaximumforYear;
      if(year != current){
        this.years.push(year);
        current = year;
        this.minArray.push(min);
        this.maxArray.push(max);
      }
      if(counter % 4 == 1){
        this.open.push(value);
        
      }
      if(counter % 4 == 0){
        this.close.push(value);
      }
      counter++;
    }
    );
    console.log(this.maxArray);
    console.log(this.minArray);
    // Make the graph using the Plotly command and style it appropriately
    let data = [{
      x: this.years,

      close: this.close,

      decreasing: { line: { color: '#8B0000' } },

      high: this.maxArray,

      increasing: { line: { color: '#228B22' } },

      low: this.minArray,

      open: this.open,

      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y'
    }];

    let layout = {
      dragmode: 'zoom',
      showlegend: false,
      title: "Airplane Ticket Cost From 1995 to 2017 (Sample)",

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
        title: 'Year',
        type: 'date',
        rangeslider: {
          visible: false
        }
      },

      yaxis: {
        autorange: true,
        domain: [0, 1],
        title: 'Cost (USD)',
        type: 'linear'
      }
    };

    Plotly.newPlot('graphDiv', data, layout, { responsive: true });
    this.graphExists = true;
  }
}
