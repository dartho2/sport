import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from '../layout/header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SearchPipe } from './admin/_pipe/search/search.pipe';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductsCreateComponent } from './products/products-create/products-create.component';
import { DishesListComponent } from './p-restaurant/p-storage/dish/dishes-list/dishes-list.component';
// import { DishesCreateComponent } from './dish/dishes-create/dishes-create.component';
import { AnalysticListComponent, DialogAnalysticDialog } from './analystic/analystic-list/analystic-list.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { CalculateListComponent } from './calculate/calculate-list/calculate-list.component';
import { DishesCreateComponent } from './p-restaurant/p-storage/dish/dishes-create/dishes-create.component';
import { RecipeListComponent } from './p-restaurant/p-storage/recipe/recipe-list/recipe-list.component';
import { SemiproduktListComponent } from './semiproduct/semiprodukt-list/semiprodukt-list.component';
import { ProductShowComponent } from './products/products-show/product-show.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ColdListComponent } from './haccp/cold-list/cold-list.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { BetComponent } from './bet/bet-list/bet.component';
import { CalendarComponent } from './calendar/calendar.component';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';
import { NavbarSportComponent } from '../layout/sport/navbar-sport/navbar-sport.component';
import { LayoutComponent } from '../layout/sport/layout/layout.component';
import { MatchListComponent } from './analystic/match-list/match-list.component';
import { HomeComponent } from './home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PRestaurantComponent } from './p-restaurant/p-restaurant.component';
import { PWorkerComponent } from './p-worker/p-worker.component';
import { PersonelListComponent } from './p-restaurant/p-personel/personel-list/personel-list.component';
import { GraphicListComponent } from './p-restaurant/p-graphics/graphic-list/graphic-list.component';
import { StorageListComponent } from './p-restaurant/p-storage/storage-list/storage-list.component';
// import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
registerLocaleData(localePl, 'pl-PL');
import { BreadcrumbModule, BreadcrumbService } from 'angular-crumbs';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { StorageCreateComponent } from './p-restaurant/p-storage/storage-create/storage-create.component';
import { AlertModule } from '../_alert/alert.module';
import { PProductsListComponent } from './p-restaurant/p-storage/products/p-products-list/p-products-list.component';
import { PProductsCreateComponent } from './p-restaurant/p-storage/products/p-products-create/p-products-create.component';
import { PProductsShowComponent } from './p-restaurant/p-storage/products/p-products-show/p-products-show.component';
import { DishShowComponent } from './p-restaurant/p-storage/dish/dish-show/dish-show.component';
import { ChipsComponent } from './shared/widgets/chips/chips.component';
import { RecipeCreateComponent } from './p-restaurant/p-storage/recipe/recipe-create/recipe-create.component';
import { RecipeShowComponent } from './p-restaurant/p-storage/recipe/recipe-show/recipe-show.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';

// import { BreadCrumbParamService } from './shared/breadcrumb/breadcrumb.service';
@NgModule({
  imports: [
    AlertModule,
    BreadcrumbModule,
    MatTableExporterModule,
    FlexLayoutModule,
    HttpClientModule,
    ChartsModule,
    ScrollingModule,
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule
  ],
  declarations: [
    DialogComponent,
    DialogAnalysticDialog,
    LayoutComponent,
    AdminComponent,
    CalendarComponent,
    HeaderComponent,
    NavbarComponent, NavbarSportComponent,
    ProductsListComponent,
    ProductsCreateComponent,
    DishesListComponent,
    DishesCreateComponent,
    AnalysticListComponent,
    SearchPipe,
    EventListComponent,
    CalculateListComponent,  
    RecipeListComponent, 
    SemiproduktListComponent, 
    ProductShowComponent, 
    ColdListComponent, 
    BetComponent, 
    MatchListComponent, 
    HomeComponent, 
    PRestaurantComponent, 
    PWorkerComponent, 
    PersonelListComponent, 
    GraphicListComponent, 
    StorageListComponent, 
    BreadcrumbComponent, 
    StorageCreateComponent, PProductsListComponent, PProductsCreateComponent, PProductsShowComponent, DishShowComponent, ChipsComponent, RecipeCreateComponent, RecipeShowComponent
  ],
  entryComponents: [DialogComponent, DialogAnalysticDialog],
  bootstrap: [],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: "pl-PL" },


    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  
]
})
export class AdminModule { }