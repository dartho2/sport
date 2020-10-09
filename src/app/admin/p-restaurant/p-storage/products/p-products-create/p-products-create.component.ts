import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Storage } from '../../storage.model';
import { StorageService } from '../../storage.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { AlertService } from 'src/app/_alert/alert.service';
export interface Product {
  name: string;
}
@Component({
  selector: 'app-pproducts-create',
  templateUrl: './p-products-create.component.html',
  styleUrls: ['./p-products-create.component.css']
})
export class PProductsCreateComponent implements OnInit {


  @Input() foodCost: any;
  @Input() ProductDish;
  productSelected;
  filteredOptions: Observable<Storage[]>;
  myControl = new FormControl();
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  selectedOptions;
  selectPackage;
  productId;
  value: ['kg', 'szt', 'l'];
  valueSupplier: ['KŚ', 'WoA', 'W', 'Pp', 'Sk', 'In', 'Re'];
  mode;
  customeImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6hC4zK0RMvnALdCE7WM3dmdD99-5OGybTgZ6ZP2HsCjCnD_P49g&s";
  options: Storage[] = [];
  totalPrice;
  data = {
    recipe: [
      {
        id: '',
        name: '',
        nettoPrice: '',
        bruttoPrice: '',
        weight: '',
        vat: '',
        unit: '',
        productWeight: '',
        valueProduct: '',
        productDate: '',
      }
    ]
  }
  bodyForm: FormGroup;
  selectedValue;
  product: Product;
  pr_data;
  message;
  storageId: string;
  productDataId: any;

  constructor(private _fb: FormBuilder,private alertService: AlertService,private route: ActivatedRoute, private router: Router, private storageService: StorageService) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idStorage")) {
        this.storageId = paramMap.get("idStorage");
        this.storageService.getPosStorage(this.storageId).subscribe((response: any) => {
          this.options = response.products
          if (paramMap.has("idProduct")) {
            this.mode = "edit";
            this.productId = paramMap.get("idProduct");
            this.storageService.getProductID(this.productId).subscribe(productData => {
              this.buildForm(productData);
              this.bodyForm.value.supplier === 'Re' ? this.selectedValue = "Re" : '';
            })
          } else {
            this.mode = "create";
          }
        });
      }
    });

  }
  get formData() {
    return <FormArray>this.bodyForm.get('recipe');
  }

  supplieronChange(date) {
    console.log(date)
  }
  ngOnInit() {

    if (this.foodCost) {
      this.buildFormforProducts(this.foodCost)
      this.bodyForm.value.supplier === 'Pp' ? this.selectedValue = "Pp" : '';
    } else {
      this.bodyForm = new FormGroup({
        _id: new FormControl(null),
        name: new FormControl('', [Validators.required, Validators.minLength(4)]),
        description: new FormControl('', [Validators.required, Validators.minLength(4)]),
        image: new FormControl(this.customeImg),
        nettoPrice: new FormControl('', Validators.required),
        unit: new FormControl('', Validators.required),
        qty: new FormControl(null),
        weight: new FormControl('', Validators.required),
        vat: new FormControl('', Validators.required),
        bruttoPrice: new FormControl(null),
        productDate: new FormControl(null),
        supplier: new FormControl('', Validators.required),
        losses: new FormControl(null),
        lossesPriceNetto: new FormControl(null),
        history: this._fb.array([]),
        recipe: this._fb.array([])
      });
    }
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }
  displayFn(product?: Product): String | undefined {
    return product ? product.name : undefined;
  }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  onChange(selectedValue, y) {
    this.productSelected = this.options.filter(item => item.name === selectedValue.name);
    let control = (<FormArray>this.bodyForm.controls.recipe).at(y);
    this.productSelected.forEach(x => {
      control.setValue({
        id: x._id,
        name: x.name,
        nettoPrice: x.nettoPrice,
        bruttoPrice: x.bruttoPrice,
        weight: x.weight,
        unit: x.unit,
        vat: x.vat,
        productWeight: x.productWeight ? x.productWeight : '',
        productDate: x.productDate,
        valueProduct: x.valueProduct ? x.valueProduct : ''
      })
    });
  }

  setCities() {
    let control = <FormArray>this.bodyForm.controls.recipe;
    this.data.recipe.forEach(x => {
      control.push(this._fb.group({
        id: x.id,
        name: x.name,
        nettoPrice: x.nettoPrice,
        bruttoPrice: x.bruttoPrice,
        weight: x.weight,
        vat: x.vat,
        unit: x.unit,
        productWeight: x.productWeight,
        valueProduct: x.valueProduct,
        productDate: x.productDate,

      }))
    })
  }
  buildFormforProducts(foodCost): FormGroup {
    return this.bodyForm = this._fb.group({
      _id: null,
      name: foodCost.name ? foodCost.name : '',
      description: foodCost.description ? foodCost.description : '',
      image: this.customeImg,
      nettoPrice: foodCost.foodCost ? foodCost.foodCost : '',
      unit: '',
      qty: '',
      weight: '',
      vat: foodCost.vat ? foodCost.vat : '',
      bruttoPrice: '',
      supplier: 'Pp',
      losses: '',
      lossesPriceNetto: '',
      productDate: '',
      history: this._fb.array(
        this.getHistory(null)
      ),
      recipe: this._fb.array(
        this.getRecipe(null)
      )
    })
  }

  buildForm(data: any): FormGroup {
    return this.bodyForm = this._fb.group({
      _id: [data ? data._id : null],
      name: [data ? data.name : '',],
      description: [data ? data.description : '',],
      image: [data ? data.image : this.customeImg],
      nettoPrice: [data ? data.nettoPrice : '',],
      unit: [data ? data.unit : '',],
      qty: [data ? data.qty : '',],
      weight: [data ? data.weight : '',],
      vat: [data ? data.vat : '',],
      bruttoPrice: [data ? data.bruttoPrice : '',],
      supplier: [data ? data.supplier : '',],
      losses: [data ? data.losses : '',],
      lossesPriceNetto: [data ? data.lossesPriceNetto : '',],
      productDate: [data ? data.productDate : '',],
      history: this._fb.array(
        this.getHistory(data ? data.history : null)
      ),
      recipe: this._fb.array(
        this.getRecipe(data ? data.recipe : null)
      )
    })
  }
  getRecipe(recipe: any): FormGroup[] {
    return recipe ? recipe.map(recipeBody => {
      return this._fb.group({
        name: [recipeBody.name],
        nettoPrice: [recipeBody.nettoPrice],
        bruttoPrice: [recipeBody.bruttoPrice],
        weight: [recipeBody.weight],
        unit: [recipeBody.unit],
        vat: [recipeBody.vat],
        productDate: [recipeBody.productDate],
        id: [recipeBody.id],
        productWeight: [recipeBody.productWeight],
        valueProduct: [recipeBody.valueProduct]
      });
    }) : []
  }
  getHistory(history: any): FormGroup[] {
    return history ? history.map(historyBody => {
      return this._fb.group({
        supplier: [historyBody.supplier],
        nettoPrice: [historyBody.nettoPrice],
        bruttoPrice: [historyBody.bruttoPrice],
        losses: [historyBody.losses],
        lossesPriceNetto: [historyBody.lossesPriceNetto],
        qty: [historyBody.qty],
        vat: [historyBody.vat],
        productDate: [historyBody.productDate],
      });
    }) : []
  }
  setDateHistory() {
    this.pr_data = new Date().toISOString()
  }
  onAddContent() {
    if (this.mode === "edit") {
      this.setDateHistory();
      this.bodyForm.controls['bruttoPrice'].patchValue(this.calculateTotalPrice(this.bodyForm.value))
      this.bodyForm.controls['productDate'].patchValue(this.pr_data);
      this.storageService.updateStorageProduct(this.bodyForm.value).subscribe(response => {
        this.router.navigate(["../../"], { relativeTo: this.route });
        this.alertService.success("Success", response);
      })
    } else {
      
      if (this.bodyForm.value.losses) {
        const lossesPriceNetto = (this.bodyForm.value.nettoPrice * (1 + this.bodyForm.value.losses / 100)).toFixed(2)
        this.bodyForm.controls['lossesPriceNetto'].setValue(lossesPriceNetto)
      }
      this.bodyForm.value.bruttoPrice = this.calculateTotalPrice(this.bodyForm.value)
      delete this.bodyForm.value._id
      this.storageService.createStorageProduct(this.bodyForm.value).pipe(
        map((res: Response) => {
        this.productDataId = res // id productu
        this.storageService.getPosStorage(this.storageId).subscribe(storage => { //dostaje storage gdzie product ma isc
          var jsonStorage;
          jsonStorage = storage;
          jsonStorage.products = jsonStorage.products || [];
          jsonStorage.products.push({"_id": this.productDataId._id})
          
          this.storageService.createStorage(this.storageId, jsonStorage).subscribe(() => {
            this.router.navigate(["../"], { relativeTo: this.route });
            this.alertService.success('Success!!', res)
          })
        })
      })).subscribe(response => {
      })

    };
  }
  calculate(i) {
    let control = (<FormArray>this.bodyForm.controls.recipe).at(i);
    if (control.value.lossesPriceNetto && control.value.productWeight && control.value.lossesPriceNetto) {
      control.patchValue({
        productWeight: control.value.productWeight.replace(',', '.'),
        valueProduct: ((control.value.lossesPriceNetto * control.value.productWeight.replace(',', '.'))
          / control.value.weight).toFixed(2)
      })
      this.calculatePrice();
    } else {
      if (control.value.productWeight && control.value.nettoPrice) {
        control.patchValue({
          productWeight: control.value.productWeight.replace(',', '.'),
          valueProduct: ((control.value.nettoPrice * control.value.productWeight.replace(',', '.'))
            / control.value.weight).toFixed(2)
        })
      }
      this.calculatePrice();
    }

  }
  calculatePrice() {
    this.totalPrice = 0;
    let control = (<FormArray>this.bodyForm.controls.recipe);
    control.value.forEach(x => {
      this.totalPrice = parseFloat(x.valueProduct) + (this.totalPrice ? parseFloat(this.totalPrice) : 0)
    });
    let controls = <FormGroup>this.bodyForm;
    controls.patchValue({
      nettoPrice: this.totalPrice.toFixed(2),
      vat: "8"
    });
  }
  calculateTotalPrice(price) {
    this.setDateHistory();
    this.bodyForm.value.nettoPrice = this.bodyForm.value.nettoPrice.replace(',', '.');
    this.bodyForm.value.weight = this.bodyForm.value.weight.replace(',', '.');
    this.bodyForm.controls['productDate'].patchValue(this.pr_data);
    if (price.nettoPrice === 0) {
      this.bodyForm.value.bruttoPrice = (price.vat).toFixed(2);
    } else {
      this.bodyForm.value.bruttoPrice = (price.nettoPrice * (price.vat / 100 + 1)).toFixed(2);
    }
    this.bodyForm.controls['bruttoPrice'].patchValue(this.bodyForm.value.bruttoPrice);
    (<FormArray>this.bodyForm.controls['history']).value.push({
      "supplier": this.bodyForm.value.supplier,
      "nettoPrice": this.bodyForm.value.nettoPrice,
      "bruttoPrice": this.bodyForm.value.bruttoPrice,
      "losses": this.bodyForm.value.losses,
      "lossesPriceNetto": this.bodyForm.value.lossesPriceNetto,
      "qty": this.bodyForm.value.qty,
      "vat": this.bodyForm.value.vat,
      "productDate": this.bodyForm.value.productDate
    });
    return this.bodyForm.value.bruttoPrice
  }
  deleteCity(index) {
    let control = <FormArray>this.bodyForm.controls.recipe;
    control.removeAt(index)
    this.calculatePrice();
  }
  gotoBack() {
    if (this.mode === 'edit') {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
  addNewCity() {
    let control = <FormArray>this.bodyForm.controls.recipe;
    control.push(
      this._fb.group({
        id: '',
        name: '',
        nettoPrice: '',
        bruttoPrice: '',
        weight: '',
        vat: '',
        unit: '',
        productWeight: '',
        valueProduct: '',
        productDate: ''
      })
    )
    this.myControl.patchValue('')
  }
}