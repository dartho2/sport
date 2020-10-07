import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DishServices } from '../dish-services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Dish } from '../dish.model';
import { MatDialog, MAT_DIALOG_DATA , MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { RestaurantService } from '../../../../shared/restaurants/restaurants.service';
import { AlertService } from 'src/app/_alert/alert.service';
import { StorageService } from '../../storage.service';
import { ChipsService } from '../../../../shared/widgets/services/chips.service'
import { Subscription } from 'rxjs';
export interface DialogData {
}
export interface DishData {
  id: string;
  name: string;
  nettoPrice: string;
  vat: string;
  bruttoPrice: string;
  weight: string;
  unit: string;
  details: string;
}

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DishesListComponent implements AfterViewInit, OnInit {
  messages: any[] = [];
  subscription: Subscription;
  dish;
  buttonTable: Boolean = true;
  checked = true;
  dishData;
  valueRe;
  filDish = "Hosomaki";
  dataSource = new MatTableDataSource<DishData>();
  displayedColumns: string[] = [
    'image',
    'name',
    'category',
    'bruttoPrice',
    'foodCost',
    'productMarginFC',
    'details',
    'update',
    'delete'
  ];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  storage: any;
  dishesData: any;
  sortedData: DishData[];
  itemFilter: any;
  item: any;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog, private restaurantService: RestaurantService,
    private route: ActivatedRoute, private dishService: DishServices, private alertService: AlertService,
    private storageService: StorageService, private chipsService: ChipsService) {
    this.restaurantService.getRestaurant().subscribe(response => {
      this.valueRe = response

    })
    this.subscription = this.chipsService.getCategory().subscribe(message => {
      if (message) {
        this.dataSource.data= this.dishesData
        this.dataSource.data = this.dataSource.data.filter(function(item :any) {
          return message.includes(item.category) ? true : false;
        });
        this.messages.push(message);
      } else {
        this.dataSource.data= this.dishesData
        this.messages = [];
      }
    });
  }
  onChange(name) {
    if (name !== 'All') {
      let newDate = this.dishData.filter(x => x.categoryRes === name);
      this.dataSource.data = newDate
    } else {
      this.dataSource.data = this.dish
    }
  }
 
  openDialog(dish) {

    const dialogRef = this.dialog.open(DialogDataListDialog, {
      disableClose: false,
      panelClass: "my-full-screen-dialog",
      data: dish
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onValChange(a) {
    this.buttonTable = !this.buttonTable
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idStorage")) {
        const id = paramMap.get("idStorage");
        this.storageService.getPosStorage(id).subscribe(response => {
          this.storage = response
          this.dishesData = this.storage.dishes;
          this.addComp(this.dishesData)
          this.dataSource.data = this.dishesData;
          this.dataSource.data = _.sortBy(this.dishesData, 'category')
        })
      }

    })

  }
  addComp(itemsData){
    this.item = itemsData
    .map(item => item.category)
    .filter((value, index, self) => self.indexOf(value) === index)
    this.chipsService.sendMessage(this.item)
  }

  dishDelete(id) {
    if (confirm("Are you sure to delete " + id)) {
      this.dishService.deleteDish(id).subscribe(() => {
        this.alertService.info("Success", "Deleted")
      })
    }
  }
  sortData(name, isAsc) {
    const data = this.dataSource.data.slice();
    this.dataSource.data = data;
    this.dataSource.data = data.sort((a, b) => {
      return compare(a[name], b[name], isAsc);
    });
  }


}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  styleUrls: ['./dialog-data-example-dialog.css'],

})
export class DialogDataListDialog {
 
  constructor( 
    public dialogRef: MatDialogRef<DialogDataListDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
