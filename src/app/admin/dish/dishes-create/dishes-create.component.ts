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
  wynik;
  controlButton = 0;
  mode;
    data = {
      products: [
        {
          id: '',
          name: '',
          price: '',
          weight: '',
          unit: '',
          productweight: '',
          valueproduct: ''
        }
      ]
    }


  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService, private dishService :DishServices) {
    this.productService.getProduct().subscribe(response => {
      this.product = response
      this.options =this.product
    });
    this.myForm = this._fb.group({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      price_p: new FormControl('', Validators.required),
      products: this._fb.array([])
    })

    this.setCities();
  }


get formData() {
    return <formArray>this.myForm.get('products');
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
    
    //Validacja do dodania
    // this.wynik=0;
    // this.controlButton =1;
    // let control = (<FormArray>this.myForm.controls.products);
    //   control.value.forEach(x => {
    //    this.wynik = parseFloat(x.valueproduct) + (this.wynik ? parseFloat(this.wynik) : 0)
    //   })
    //   let controls = <FormGroup>this.myForm;
    //   controls.patchValue({
    //     price: this.wynik.toFixed(2)
    //   })
  }

  calculatePrice(){
     //Validacja do dodania
     this.wynik=0;
     this.controlButton =1;
     let control = (<FormArray>this.myForm.controls.products);
       control.value.forEach(x => {
        this.wynik = parseFloat(x.valueproduct) + (this.wynik ? parseFloat(this.wynik) : 0)
       })
       let controls = <FormGroup>this.myForm;
       controls.patchValue({
         price: this.wynik.toFixed(2)
       })
  }
  addNewCity() {
    let control = <FormArray>this.myForm.controls.products;
    control.push(
      this._fb.group({
        id: '',
        name: '',
        price: '',
        weight: '',
        unit: '',
        productweight: '',
        valueproduct: ''
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
        price: x.price, 
        weight: x.weight,
        unit: x.unit,
        productweight: x.productweight ? x.productweight : '',
        valueproduct: x.valueproduct ? x.valueproduct : '',
        }))
    })
  }
  calculate(i) {
    let control = (<FormArray>this.myForm.controls.products).at(i);
    control.patchValue({
      productweight: control.value.productweight.replace(',', '.'),
      valueproduct: ((control.value.price*control.value.productweight.replace(',', '.'))/control.value.weight).toFixed(2)
    })
  }
  onChange(selectedValue, y) {
    this.productSelected = this.product.filter(item => item.name === selectedValue);
    let control = (<FormArray>this.myForm.controls.products).at(y);
    this.productSelected.forEach(x => {
         control.setValue({
           id: x._id,
          name: x.name, 
          price: x.price, 
          weight: x.weight,
          unit: x.unit,
          productweight: x.productweight ? x.productweight.replace(',', '.') : '',
          valueproduct: x.valueproduct ? x.valueproduct : ''})
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




 
