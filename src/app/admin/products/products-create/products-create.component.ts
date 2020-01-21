import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Product } from '../product.model'
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
export interface Product {
  name: string;
}
@Component({
  selector: 'app-products-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.css']
})
export class ProductsCreateComponent implements OnInit {

  @Input()
  foodCost;
  @Input()
  ProductDish;
  productSelected;
  filteredOptions: Observable<Product[]>;
  myControl = new FormControl();
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  selectedOptions;
  selectPackage;
  productId;
  value: ['kg', 'szt', 'l'];
  valueSupplier: ['KŚ', 'WoA', 'W', 'Pp', 'Sk', 'In', 'Re'];
  mode;
  options: Product[] = [];
  productRecipe;
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

  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService) {
    this.productService.getProduct().subscribe(response => {
      this.productRecipe = response
      this.options = this.productRecipe
    });
    if (this.foodCost) {
      this.buildFormforProducts(this.foodCost)
    } else {
      this.bodyForm = new FormGroup({
        _id: new FormControl(null),
        name: new FormControl('', [Validators.required, Validators.minLength(4)]),
        description: new FormControl('', [Validators.required, Validators.minLength(4)]),
        image: new FormControl(null),
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
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idProduct")) {
        this.mode = "edit";
        this.productId = paramMap.get("idProduct");
        this.productService.getProductID(this.productId).subscribe(productData => {
          this.buildForm(productData);
          this.bodyForm.value.supplier === 'Re' ? this.selectedValue = "Re" : '';
          console.log(this.myControl)

        })
      } else {
        this.mode = "create";
      }
    });

    this.setCities();
  }
  get formData() {
    return <FormArray>this.bodyForm.get('recipe');
  }
  supplieronChange(date) {
    console.log(date)
  }
  ngOnInit() {
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
    this.productSelected = this.productRecipe.filter(item => item.name === selectedValue.name);
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
      name: '',
      description: '',
      image: '',
      nettoPrice: foodCost ? foodCost : '',
      unit: '',
      qty: '',
      weight: '',
      vat: '',
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
      image: [data ? data.image : '',],
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
      this.productService.updateProduct(this.bodyForm.value).subscribe(response => {
        this.message = "Został utworzony";
          this.router.navigate(["../../"], { relativeTo: this.route });
      })
    } else {
      delete this.bodyForm.value._id
      if (this.bodyForm.value.losses) {
        const lossesPriceNetto = (this.bodyForm.value.nettoPrice * (1 + this.bodyForm.value.losses / 100)).toFixed(2)
        this.bodyForm.controls['lossesPriceNetto'].setValue(lossesPriceNetto)
      }
      this.bodyForm.value.bruttoPrice = this.calculateTotalPrice(this.bodyForm.value)
      this.productService.createProduct(this.bodyForm.value).subscribe(() => {
        this.foodCost ? this.message = "Został utworzony" :
          this.router.navigate(["../"], { relativeTo: this.route });
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
