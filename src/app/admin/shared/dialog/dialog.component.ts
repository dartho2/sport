import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { VERSION, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
@Component({
  selector: 'app-alert-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  messageData: any;
  cancelButtonText = "Cancel"
  type: string = null
  historyProduct: any = [];
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Crude oil prices' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogComponent>, private datePipe: DatePipe) {
    if (data) {
      this.messageData = data.message || this.messageData;
      this.type = data.type || this.type
    //   REFACTORING
      if(this.type === 'product'){
        this.historyProduct = this.messageData.history.map(x => x.nettoPrice);
        this.lineChartData =  [{data: this.historyProduct, label: 'Cena Netto'}];
        this.lineChartLabels = this.messageData.history.map(x => (this.datePipe.transform(new Date(x.productDate))))}
        // REFACTORING
      if (data.buttonText) {
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}