import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SingleDayWeatherComponent } from './weather/single-day-weather/single-day-weather.component';
import { SevenDayWeatherComponent } from './weather/seven-day-weather/seven-day-weather.component';

    const routes: Routes = [
        {
            path: '',
            component: HomeComponent,
        },

        {
            path: 'about',
            component: AboutComponent,
        },

        {
            path: 'weather/oneday',
            component: SingleDayWeatherComponent,
        },

        {
            path: 'weather/sevenday',
            component: SevenDayWeatherComponent,
        }
    ];

    @NgModule({
        imports: [
            RouterModule.forRoot(routes)
        ],
        exports: [
            RouterModule
        ],
        declarations: []
    })
    export class AppRoutingModule {
    }
