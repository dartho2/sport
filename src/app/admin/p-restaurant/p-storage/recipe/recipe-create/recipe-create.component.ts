import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from '../../products/product.service';
import { RecipeService } from '../recipe.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantService } from '../../../../shared/restaurants/restaurants.service';
import { AlertService } from 'src/app/_alert/alert.service';
import { StorageService } from '../../storage.service';
import { toInteger, toString } from 'lodash';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ApiEbidService } from 'src/app/admin/shared/api/e-bid/apiebid.service';
export interface DialogData {
  foodCost: '';
}
export interface Product {
  name: string;
}
@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  myControl = new FormControl();
  options: Product[] = [];
  filteredOptions: Observable<Product[]>[]=[];
  productSelected;
  myForm: FormGroup;
  selectItems: any;
  customeImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6hC4zK0RMvnALdCE7WM3dmdD99-5OGybTgZ6ZP2HsCjCnD_P49g&s";
  product;
  alert;
  messageContent;
  foodCost;
  fC;
  productMarginFC;
  message;
  productMargin;
  controlButton = 0;
  mode;
  valueRe;
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
  dishId: string;
  dishDataId: any;
  storageId: string;
  idDishe: string;
  recipeDataId: any;
  idRecipe: string;
  idRecipeitems: string;
  apiBid:any;
  productEbid: any[];
 
  isReady:boolean = false;
  constructor(private _fb: FormBuilder,
    private authenticationService: AuthenticationService, 
    private apiEbidService: ApiEbidService,
     private restaurantService: RestaurantService, 
    private route: ActivatedRoute, private router: Router, 
    private productService: ProductService, private storageService: StorageService, private alertService: AlertService, private recipeService: RecipeService, public dialog: MatDialog) {
      this.authenticationService.currentUserApi.subscribe(x => this.apiBid = x);
       this.productService.getProduct().subscribe(response => {
      this.product = response
      this.options = this.product
    });
    this.myForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      description: new FormControl('', [Validators.required, Validators.minLength(4)]),
      image: new FormControl(this.customeImg),
      weight: new FormControl('', Validators.required),
      unit: new FormControl('', Validators.required),
      nettoPrice: new FormControl(''),
      bruttoPrice: new FormControl(''),
      vat: new FormControl('', Validators.required),
      history: this._fb.array([]),
      products: this._fb.array([])
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idRecipe")) {
        this.idRecipe = paramMap.get("idRecipe");
      
          if (paramMap.has("idRecipeitems")) {
            this.mode = "edit";
            this.idRecipeitems = paramMap.get("idRecipeitems");
            this.recipeService.getRecipeitemsID(this.idRecipeitems).subscribe(recipeitemData => {
              var w:any
               w =recipeitemData
              this.buildFormDish(recipeitemData);
              for (let i = 0; i < w.products.length; i++) {
                this.addAutocomplite(i)
              }
              this.isReady = true
            })
          } else {
            this.mode = "create";
            this.isReady = true
          }
        
      }
    });
  }
  searchEBID(filterValue: string, index){
    if(filterValue.length > 1){
      this.apiEbidService.getEBID(filterValue).subscribe((x: any) =>{
        this.productEbid = x.products
        console.log(this.productEbid ,"ebid")
      })
    }
  }
  supplieronChange(date) {
    console.log(date)
  }
  onChange(selectedValue, y) {
   this.productSelected = this.product.filter(item => item.name === selectedValue.value);
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
        valueProduct: x.valueProduct ? x.valueProduct : ''
      })
    });
  }
  onChangeEbid(selectedValue, y) {
    this.productSelected = this.productEbid.filter(item => item.name === selectedValue.value);
    let control = (<FormArray>this.myForm.controls.products).at(y);
    this.productSelected.forEach(x => {
      var n= (x.units_of_measure[0].price_net/100)
      var b = (x.units_of_measure[0].price_gross/100)
      var v = (Math.round(100-((n*100)/b)))
      var q = x.units_of_measure[0].quantity
      control.setValue({
        id: x.id,
        name: x.name,
        nettoPrice: n.toString(),
        weight: q.toString(),
        bruttoPrice: b.toString(),
        unit: x.unit_for_price_per_unit,
        lossesPriceNetto: x.lossesPriceNetto ? x.lossesPriceNetto : '',
        productWeight: x.productWeight ? x.productWeight.replace(',', '.') : '',
        valueProduct: x.valueProduct ? x.valueProduct : ''
      })
    });
  }
  displayFn(product?: any): string | undefined {
     return product ? product : undefined;
  }
  get name() { return this.myForm.get('name'); }
  get products() { return this.myForm.get('products') as FormArray }
  get bruttoPrice() { return this.myForm.get('bruttoPrice'); }

  get formData() {
    return <FormArray>this.myForm.get('products');
  }
  getErrorMessage(name: string) {
    return this.myForm.controls[name].hasError('required') ? 'You must enter a value' :
      this.myForm.controls[name].hasError('minlength') ? 'Min length 3' :
        '';
  }

  onSubmit() {
    if (this.mode === "edit") {
      // this.recipeService.updateDish(this.myForm.value).subscribe(response => {
        
      //   this.router.navigate(["../../"], { relativeTo: this.route });
      //   this.alertService.success("Success","Update")
      // })
    } else {
      var totalPriceNetto = 0;
      this.myForm.value.products.forEach(element => {
        totalPriceNetto += parseFloat(element.valueProduct)
      });
      var v = this.myForm.value.vat
      var n = totalPriceNetto
      this.myForm.value.nettoPrice = toString(totalPriceNetto)
      this.myForm.value.bruttoPrice   = toString((totalPriceNetto*(toInteger(this.myForm.value.vat)/100)+1).toFixed(2))
      // this.myForm.value.bruttoPrice  =  this.myForm.value.bruttoPrice.toFixed(2)
      this.recipeService.createRecipeItems(this.myForm.value).pipe(
        map((res: Response) => {
          this.recipeDataId = res // id productu
          this.recipeService.getPosRecipe(this.idRecipe).subscribe(storage => { //dostaje storage gdzie product ma isc
            var jsonStorage;
            jsonStorage = storage;
            jsonStorage.recipeitems = jsonStorage.recipeitems || [];
            jsonStorage.recipeitems.push({"_id": this.recipeDataId._id})
            this.recipeService.createRecipeItemsforRecipe(this.idRecipe, jsonStorage).subscribe(() => {
              this.router.navigate(["../"], { relativeTo: this.route });
              this.alertService.success('Success!!', res)
            })
          })
        

        })
      ).subscribe(response => {
        console.log(response)
      })
        // this.router.navigate(["../../"], { relativeTo: this.route });
        // this.alertService.success("Success", response);
   
    //   delete this.myForm.value._id
    //   this.recipeService.createDish(this.myForm.value).pipe(
    //     map((res: Response) => {
    //     this.dishDataId = res // id productu
    //     this.storageService.getPosStorage(this.storageId).subscribe(storage => { //dostaje storage gdzie product ma isc
    //       var jsonStorage;
    //       jsonStorage = storage;
    //       jsonStorage.dishes = jsonStorage.dishes || [];
    //       jsonStorage.dishes.push({"_id": this.dishDataId._id})
          
    //       this.storageService.createStorage(this.storageId, jsonStorage).subscribe(() => {
    //         this.router.navigate(["../"], { relativeTo: this.route });
    //         this.alertService.success('Success!!', res)
    //       })
    //     })
    //   })).subscribe(response => {
    //   })
    };
  }

  calculatePrice() {
    this.foodCost = 0;
    this.fC = 0;
    this.controlButton = 1;
    if (this.myForm.controls.products.status === 'VALID' && this.myForm.value.bruttoPrice) {
      let control = (<FormArray>this.myForm.controls.products);
      control.value.forEach(x => {
        this.productMarginFC = parseFloat(x.valueProduct) + (this.foodCost ? parseFloat(this.foodCost) : 0)
        this.foodCost = parseFloat(x.valueProduct) + (this.foodCost ? parseFloat(this.foodCost) : 0) //FC w zł
        this.coating = (this.myForm.value.bruttoPrice - this.foodCost) / this.foodCost //Narzut w %
        this.productMargin = ((this.myForm.value.bruttoPrice - this.foodCost) / this.myForm.value.bruttoPrice) * 100 //Marza od ceny sprzedazy
        this.productMarginFC = parseFloat(this.coating) * 100 // Marza od FC
        // this.fC = ((this.foodCost*100)/((parseFloat(this.myForm.value.bruttoPrice)*100)/(this.myForm.value.vat+100))) 
        this.fC = ((100 * this.foodCost) / this.myForm.value.bruttoPrice / (this.myForm.value.vat / 100 + 1))//FC % 
      })
      let controls = <FormGroup>this.myForm;
      controls.patchValue({
        foodCost: this.foodCost.toFixed(2),
        productMargin: this.productMargin.toFixed(0),
        coating: this.coating.toFixed(2),
        productMarginFC: this.productMarginFC.toFixed(0),
        fC: this.fC.toFixed(0)
      });
      this.alertService.success("Success","Poprawnie Przeliczono!")
    } else {
      this.alertService.warn("Info","Uzupełnij Wszystkie Dane");
    }
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
        lossesPriceNetto: '',
        productWeight: '',
        valueProduct: ''
      })
    )
    this.addAutocomplite(control.length -1)
    this.myControl.patchValue('')
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
        productWeight: new FormControl(x.productWeight ? x.productWeight : '', Validators.required),
        valueProduct: x.valueProduct ? x.valueProduct : '',
      }))
    })
  }
  calculate(i) {

    let control = (<FormArray>this.myForm.controls.products).at(i);
    console.log(control.status)
    if (control.value.lossesPriceNetto && control.value.productWeight && control.value.lossesPriceNetto) {
      control.patchValue({
        productWeight: control.value.productWeight.toString().replace(',', '.'),
        valueProduct: ((control.value.lossesPriceNetto * control.value.productWeight.toString().replace(',', '.'))
          / control.value.weight).toFixed(2)
      })
    } else {
      console.log(control.status)
      if (control.value.productWeight && control.value.nettoPrice) {
        console.log(control.value.productWeight)
        control.patchValue({
          productWeight: control.value.productWeight.toString().replace(',', '.'),
          valueProduct: ((control.value.nettoPrice * control.value.productWeight.toString().replace(',', '.'))
            / control.value.weight).toFixed(2)

        })
      }
    }

  }
  addAutocomplite(index:number){
    var arrayControl = this.myForm.get('products') as FormArray;
    var start = arrayControl.at(index).get('name')
    this.filteredOptions[index] = arrayControl.at(index).get('name')
    // this.filteredOptions = this.myControl
    .valueChanges
    .pipe(
      startWith(start.value ? start.value : ''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }
  ngOnInit() {
  }

  buildFormDish(data: any): FormGroup {
    return this.myForm = this._fb.group({
      _id: [data ? data._id : null],
      name: [data ? data.name : '',],
      description: [data ? data.description : '',],
      image: [data ? data.image : this.customeImg],
      category: [data ? data.category : null],
      vat: [data ? data.vat : '',],
      fC: [data ? data.fC : '',],
      weight: [data ? data.weight : '',],
      productMargin: [data ? data.productMargin : null],
      productMarginFC: [data ? data.productMarginFC : '',],
      coating: [data ? data.coating : '',],
      bruttoPrice: [data ? data.bruttoPrice : '',],
      foodCost:  [data ? data.bruttoPrice : '',],
      unit: [data ? data.unit : '',],
      products: this._fb.array(
        this.getProducts(data ? data.products : null)
      )
    })
  } 
  getProducts(data: any): FormGroup[] {
    return data ? data.map(recipeBody => {
      return this._fb.group({
        name: [recipeBody.name],
        nettoPrice: [recipeBody.nettoPrice],
        bruttoPrice: [recipeBody.bruttoPrice],
        weight: [recipeBody.weight],
        unit: [recipeBody.unit],
        id: [recipeBody.id],
        productWeight: [recipeBody.productWeight],
        lossesPriceNetto: [recipeBody.lossesPriceNetto],
        valueProduct: [recipeBody.valueProduct]
      });
    }) : []
  }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }


}






