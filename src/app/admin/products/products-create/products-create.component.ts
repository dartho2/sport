import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Product } from '../product.model'
import { ProductService } from '../product.service';

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

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  selectedOptions;
  selectPackage;
  productId;
  value: ['kg', 'szt', 'l'];
  valueSupplier: ['KŚ', 'WoA', 'W', 'Pp', 'In'];
  mode;
  bodyForm: FormGroup;
  selectedValue;
  product: Product;
  pr_data = new Date().toISOString()
  message;

  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService) {

  }

  ngOnInit() {
    if(this.foodCost){
      this.buildFormforProducts(this.foodCost)
    }else{
    this.bodyForm = new FormGroup({
      _id: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      image: new FormControl(null),
      nettoPrice: new FormControl(null),
      unit: new FormControl(null),
      qty: new FormControl(null),
      weight: new FormControl(null),
      vat: new FormControl(null),
      bruttoPrice: new FormControl(null),
      productDate: new FormControl(null),
      supplier: new FormControl(null),
      losses: new FormControl(null),
      lossesPriceNetto: new FormControl(null),
      history: this._fb.array([])
    });
  }
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idProduct")) {
        this.mode = "edit";
        this.productId = paramMap.get("idProduct");
        this.productService.getProductID(this.productId).subscribe(productData => {
          this.buildForm(productData);
        })
      } else {
        this.mode = "create";
      }
    });
  }
  buildFormforProducts(foodCost): FormGroup {
    return this.bodyForm = this._fb.group({
      _id: null,
      name: '',
      description: '',
      image:  '',
      nettoPrice: foodCost? foodCost : '',
      unit: '',
      qty: '',
      weight: '',
      vat: '',
      bruttoPrice: '',
      supplier: 'Pp',
      losses:'',
      lossesPriceNetto: '',
      productDate: '',
      history: this._fb.array(
        this.getHistory(null)
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
      )
    })
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
  onAddContent() {
    if (this.mode === "edit") {
      this.bodyForm.controls['bruttoPrice'].patchValue(this.calculateTotalPrice(this.bodyForm.value))
      this.bodyForm.controls['productDate'].patchValue(this.pr_data);
      this.productService.updateProduct(this.bodyForm.value).subscribe(response => {
        this.message = response;
      })
    } else {
      delete this.bodyForm.value._id
      if(this.bodyForm.value.losses){
        const lossesPriceNetto = (this.bodyForm.value.nettoPrice * (1 + this.bodyForm.value.losses / 100)).toFixed(2)
        this.bodyForm.controls['lossesPriceNetto'].setValue(lossesPriceNetto)
      }
      this.bodyForm.value.bruttoPrice = this.calculateTotalPrice(this.bodyForm.value)
      this.productService.createProduct(this.bodyForm.value).subscribe(() => {
        this.foodCost? this.message="Został utworzony" :
        this.router.navigate(["../"], { relativeTo: this.route });
      })
    };
  }
  calculateTotalPrice(price) {
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
  gotoBack() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
