import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, FormControlName, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../products/product.service';
import { DishServices } from '../dish-services';
import { map, take, takeUntil, startWith } from 'rxjs/operators';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { MatSelect } from '@angular/material';
  export interface Product {
    name: string;
  }
@Component({
  selector: 'app-dishes-create',
  templateUrl: './dishes-create.component.html',
  styleUrls: ['./dishes-create.component.css']
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
          productWeight: '',
          valueProduct: ''
        }
      ]
    }
  coating: any;

  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService, private dishService :DishServices) {
    this.productService.getProduct().subscribe(response => {
      this.product = response
      this.options =this.product
    });
    this.myForm = this._fb.group({
      name: new FormControl('', Validators.required),
      foodCost: new FormControl('', Validators.required),
      bruttoPrice: new FormControl('', Validators.required),
      productMargin: new FormControl('', Validators.required),
      coating: new FormControl('', Validators.required),
      products: this._fb.array([])
    })

    this.setCities();
  }


get formData() {
    return <FormArray>this.myForm.get('products');
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
     console.log(this.myForm.controls.products)
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
  }
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
        productWeight: x.productWeight ? x.productWeight : '',
        valueProduct: x.valueProduct ? x.valueProduct : '',
        }))
    })
  }
  calculate(i) {
    let control = (<FormArray>this.myForm.controls.products).at(i);
     if(control.value.lossesPriceNetto){
      control.patchValue({
        productWeight: control.value.productWeight.replace(',', '.'),
        valueProduct: ((control.value.lossesPriceNetto*control.value.productWeight.replace(',', '.'))
        /control.value.weight).toFixed(2)
      })
     }else{
         control.patchValue({
      productWeight: control.value.productWeight.replace(',', '.'),
      valueProduct: ((control.value.nettoPrice*control.value.productWeight.replace(',', '.'))
      /control.value.weight).toFixed(2)
    })
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

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}




 
