import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { DataService } from '../service/data.service';
import { EmployeePost } from '../model/EmployeePost';
import { AnnualSalary } from '../model/AnnualSalary';
import { ContratEmployee } from '../model/ContratEmployee';
import { EmployeeContrat } from '../model/EMployeeContrat';
import { DatePipe } from '@angular/common';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
};

export type avgLecChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  markers?: ApexMarkers;
  colors?: string[];
  yaxis?: ApexYAxis;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgApexchartsModule,
    RouterLink,
    MatProgressBarModule,
    NgChartsModule,
    MatTooltipModule,
    FeatherIconsComponent,
    DatePipe,
  ],
})

export class MainComponent implements OnInit {
  public areaChartOptions!: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;
  public projectOptions!: Partial<ChartOptions>;
  public smallChart1Options!: Partial<ChartOptions>;
  public smallChart2Options!: Partial<ChartOptions>;
  public smallChart3Options!: Partial<ChartOptions>;
  public smallChart4Options!: Partial<ChartOptions>;
  public performanceRateChartOptions!: Partial<ChartOptions>;
  public doughnutChartLabels: string[] = [];
  public doughnutData: number[] = [];
  public doughnutChartData!: ChartData<'doughnut'>;
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
  };
  public avgLecChartOptions!: Partial<avgLecChartOptions>;
  public xAxis: string[] = [];
  public yAxis: number[] = [];
  public dataCDD: number[] = [0,0,0,0,0,0,0,0];
  public dataCDI: number[] = [0,0,0,0,0,0,0,0];
  public dataCVP: number[] = [0,0,0,0,0,0,0,0];
  public details: EmployeeContrat[] = [];
  constructor(private dataService: DataService) {
    // constructor code
  }

  ngOnInit() {
    this.smallChart1();
    this.smallChart2();
    this.smallChart3();
    this.smallChart4();
    this.chart4();
    this.projectChart();

    this.dataService.getData().subscribe((data: EmployeePost[]) => {
      for (let i = 0; i < data.length; i++) {
        this.doughnutChartLabels.push(data[i].nomPoste);
        this.doughnutData.push(data[i].nbrEmployes);
      }
      this.diplayData(this.doughnutData, this.doughnutChartLabels);
    })

    this.dataService.getAnnualSalary().subscribe((data: AnnualSalary[]) => {
      for (let i = 0; i < data.length; i++) {
        this.xAxis.push(data[i].nom);
        this.yAxis.push(data[i].salaireAnnuelle);
      }
      this.chart1(this.xAxis, this.yAxis);
    });

    for (let i = 2017; i < 2025; i++) {
      this.dataService.getNbEmployeeByContrat(i).subscribe((res: ContratEmployee[])=>{
        for (let j = 0; j < res.length; j++) {
          switch (res[j].type) {
            case 'CDD':
              this.dataCDD[2024 - i] = res[j].nbEmployee;
              break;
            case 'CDI':
              this.dataCDI[2024 - i] = res[j].nbEmployee;
              break;
            case 'CVP':
              this.dataCVP[2024 - i] = res[j].nbEmployee;
              break;
            default:
              break;
          }
        }
        this.chart2(this.dataCDD, this.dataCDI, this.dataCVP);
      }) 
    }

    this.dataService.getContratDetails().subscribe((data: EmployeeContrat[])=>{
      this.details = data;
    })

  }

  diplayData(doughnutData: number[], doughnutChartLabels: string[]) {
    this.doughnutChartData = {
      labels: doughnutChartLabels,
      datasets: [
        {
          data: doughnutData, //[76, 154, 49, 34],
          backgroundColor: ['#60A3F6', '#7C59E7', '#DD6811', '#05986A', '#fddfee', '#hmgmfm'],
        },
      ],
    };
  }

  private smallChart1() {
    this.smallChart1Options = {
      series: [
        {
          name: 'Appointments',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#6F42C1'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart2() {
    this.smallChart2Options = {
      series: [
        {
          name: 'Operations',
          data: [5, 6, 8, 5, 7, 5, 6, 4, 3, 4, 7, 4, 9, 6, 5, 6],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#FD7E14'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart3() {
    this.smallChart3Options = {
      series: [
        {
          name: 'New Patients',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#4CAF50'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart4() {
    this.smallChart4Options = {
      series: [
        {
          name: 'Earning',
          data: [
            150, 161, 180, 150, 172, 152, 160, 141, 130, 145, 170, 140, 193,
            163, 150, 162,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#2196F3'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart1(xAxis: string[], yAxis: number[]) {
    this.avgLecChartOptions = {
      series: [
        {
          name: 'Annual Salary',
          data: yAxis//[65, 72, 62, 73, 66, 74, 63, 67],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      stroke: {
        width: 7,
        curve: 'smooth',
      },
      xaxis: {
        categories: xAxis,//['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug'],
        title: {
          text: 'Employee',
        },
      },
      yaxis: {
        title: {
          text: 'Annual Salary',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  // public dataBarChart(type: string, data: number[]){
  //   this.dataService.getNbEmployeeByContrat(type).subscribe((res: ContratEmployee[])=>{
  //     for (let i = 0; i < res.length; i++) {
  //       data.push(res[i].nbEmployee);
  //     }
  //   })
  // }

  private chart2(dataCDI: number[], dataCVP: number[], dataCDD: number[]) {
    this.barChartOptions = {
      series: [
        {
          name: 'CDI',
          data: dataCDI,
        },
        {
          name: 'CVP',
          data: dataCVP,
        },
        {
          name: 'CDD',
          data: dataCDD,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          '2017',
          '2018',
          '2019',
          '2020',
          '2021',
          '2022',
          '2023',
          '2024',
        ],
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private projectChart() {
    this.projectOptions = {
      series: [
        {
          name: 'Project A',
          type: 'column',
          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
        },
        {
          name: 'Project B',
          type: 'area',
          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
        },
        {
          name: 'Project C',
          type: 'line',
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
        },
      ],
      chart: {
        height: 400,
        type: 'line',
        stacked: false,
        foreColor: '#9aa0ac',
      },
      colors: ['#7F7D7F', '#AC93E5', '#FEA861'],
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        '01/01/2003',
        '02/01/2003',
        '03/01/2003',
        '04/01/2003',
        '05/01/2003',
        '06/01/2003',
        '07/01/2003',
        '08/01/2003',
        '09/01/2003',
        '10/01/2003',
        '11/01/2003',
      ],
      markers: {
        size: 0,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        title: {
          text: 'Revenue',
        },
        min: 0,
      },
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0) + 'k' + ' dollars';
            }
            return y;
          },
        },
      },
    };
  }

  private chart4() {
    this.performanceRateChartOptions = {
      series: [
        {
          name: 'Bill Amount',
          data: [113, 120, 130, 120, 125, 119, 126],
        },
      ],
      chart: {
        height: 380,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      colors: ['#545454'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 1,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Bill Amount($)',
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
}
