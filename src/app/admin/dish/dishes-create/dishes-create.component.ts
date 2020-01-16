import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,FormsModule , FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../products/product.service';
import { DishServices } from '../dish-services';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
export interface DialogData {
  foodCost: '';
}
  export interface Product {
    name: string;
  }
@Component({
  selector: 'app-dishes-create',
  templateUrl: './dishes-create.component.html',
  styleUrls: ['./dishes-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DishesCreateComponent implements OnInit {
  myControl = new FormControl();
  options: Product[] = [];
  filteredOptions: Observable<Product[]>;
  productSelected;
  myForm: FormGroup;
  selectItems: any;
  product;
  foodCost;
  productMargin;
  controlButton = 0;
  mode;
    data = {
      products: [
        {
          id: '',
          name: '',
          nettoPrice: '',
          bruttoPrice: '',
          weight: '',
          vat: '',
          unit: '',
          lossesPriceNetto: '',
          productWeight: '',
          valueProduct: ''
        }
      ]
    }
  coating: any;

  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService, private dishService :DishServices, public dialog: MatDialog) {
    this.productService.getProduct().subscribe(response => {
      this.product = response
      this.options =this.product
    });
    this.myForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      foodCost: new FormControl('',  Validators.required),
      bruttoPrice: new FormControl('', Validators.required),
      productMargin: new FormControl( '', Validators.required),
      coating: new FormControl( '', Validators.required),
      products: this._fb.array([])
    })

    this.setCities();
  }
  get name() { return this.myForm.get('name'); }
  get products() { return this.myForm.get('products') as FormArray }
  get bruttoPrice()  { return this.myForm.get('bruttoPrice'); }

get formData() {
    return <FormArray>this.myForm.get('products');
  }
  getErrorMessage(name: string) {
    return this.myForm.controls[name].hasError('required') ? 'You must enter a value' :
    this.myForm.controls[name].hasError('minlength') ? 'Min length 3' :
            '';
  }
  
  onSubmit(f) {
      if (this.mode === "edit") {
        this.dishService.updateDish(this.myForm.value).subscribe(response => {
          console.log("update- done!", response)})
      } else {
        delete this.myForm.value._id

        this.dishService.createDish(this.myForm.value).subscribe(()=>
        {
          this.router.navigate(["../"], {relativeTo: this.route});
        })
      };
  }

  calculatePrice(){
     this.foodCost=0;
     this.controlButton =1;
     console.log(this.myForm.controls.products, 's')
     
     if(this.myForm.controls.products.status === 'VALID' && this.myForm.value.bruttoPrice){
     let control = (<FormArray>this.myForm.controls.products);
       control.value.forEach(x => {
        this.foodCost = parseFloat(x.valueProduct) + (this.foodCost ? parseFloat(this.foodCost) : 0) 
        this.coating = (this.myForm.value.bruttoPrice -this.foodCost) / this.foodCost
        this.productMargin = ((this.myForm.value.bruttoPrice - this.foodCost) / this.myForm.value.bruttoPrice)*100
       })
       let controls = <FormGroup>this.myForm;
       controls.patchValue({
        foodCost: this.foodCost.toFixed(2),
        productMargin: this.productMargin.toFixed(0),
        coating: this.coating.toFixed(2),
       })
       console.log('controls', controls)
  }}
  addNewCity() {
    let control = <FormArray>this.myForm.controls.products;
    control.push(
      this._fb.group({
        id: '',
        name: '',
        nettoPrice: '',
        bruttoPrice: '',
        weight: '',
        unit: '',
        lossesPriceNetto: '',
        productWeight: '',
        valueProduct: ''
      })
    )
  }

  deleteCity(index) {
    let control = <FormArray>this.myForm.controls.products;
    control.removeAt(index)
  }

  setCities() {
    let control = <FormArray>this.myForm.controls.products;
    this.data.products.forEach(x => {
      control.push(this._fb.group({  
        id: x.id,
        name: x.name, 
        nettoPrice: x.nettoPrice, 
        bruttoPrice: x.bruttoPrice, 
        weight: x.weight,
        unit: x.unit,
        lossesPriceNetto: x.lossesPriceNetto ? x.lossesPriceNetto : '',
        productWeight: new FormControl(x.productWeight ? x.productWeight : '', Validators.required) ,
        valueProduct: x.valueProduct ? x.valueProduct : '',
        }))
    })
  }
  calculate(i) {
    
    let control = (<FormArray>this.myForm.controls.products).at(i);
    console.log(control.status)
     if(control.value.lossesPriceNetto && control.value.productWeight && control.value.lossesPriceNetto){
      control.patchValue({
        productWeight: control.value.productWeight.replace(',', '.'),
        valueProduct: ((control.value.lossesPriceNetto*control.value.productWeight.replace(',', '.'))
        /control.value.weight).toFixed(2)
      })
     }else{
       console.log(control.status)
       if(control.value.productWeight && control.value.nettoPrice){
        control.patchValue({
          productWeight: control.value.productWeight.replace(',', '.'),
          valueProduct: ((control.value.nettoPrice*control.value.productWeight.replace(',', '.'))
          /control.value.weight).toFixed(2)
      
    }) 
  }
      }
   
  }
  onChange(selectedValue, y) {
    this.productSelected = this.product.filter(item => item.name === selectedValue.name);
    let control = (<FormArray>this.myForm.controls.products).at(y);
    this.productSelected.forEach(x => {
         control.setValue({
           id: x._id,
          name: x.name, 
          nettoPrice: x.nettoPrice, 
          bruttoPrice: x.bruttoPrice, 
          weight: x.weight,
          unit: x.unit,
          lossesPriceNetto: x.lossesPriceNetto ? x.lossesPriceNetto : '',
          productWeight: x.productWeight ? x.productWeight.replace(',', '.') : '',
          valueProduct: x.valueProduct ? x.valueProduct : ''})
    });
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }
  displayFn(product?: Product): string | undefined {
    return product ? product.name : undefined;
  }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  openDialog() {
    
    this.dialog.open(DialogDataExampleDialog, {
      data: this.myForm.value,
    });
    console.log('VALUE',this.myForm.value)
  }
  
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})

export class DialogDataExampleDialog {
  ProductDish=true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}



 
