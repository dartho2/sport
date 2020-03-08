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
import { DishesListComponent, DialogDataListDialog } from './dish/dishes-list/dishes-list.component';
// import { DishesCreateComponent } from './dish/dishes-create/dishes-create.component';
import { AnalysticListComponent } from './analystic/analystic-list/analystic-list.component';
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
import { DishesCreateComponent, DialogDataExampleDialog } from './dish/dishes-create/dishes-create.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { SemiproduktListComponent } from './semiproduct/semiprodukt-list/semiprodukt-list.component';
import { ProductShowComponent } from './products/products-show/product-show.component';
import { GraphicsListComponent } from './graphics/graphics-list/graphics-list.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {NotificationModule } from './toastr-notification/toaster.module';
import { ColdListComponent } from './haccp/cold-list/cold-list.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { BetComponent } from './bet/bet-list/bet.component';

@NgModule({
  imports: [
    MatTableExporterModule,
    NotificationModule,
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
    AdminComponent,
    HeaderComponent,
    NavbarComponent,
    ProductsListComponent,
    ProductsCreateComponent,
    DishesListComponent, DialogDataListDialog,
    DishesCreateComponent,
    AnalysticListComponent,
    SearchPipe,
    EventListComponent,
    CalculateListComponent,
    DishesCreateComponent, DialogDataExampleDialog, RecipeListComponent, SemiproduktListComponent, ProductShowComponent, GraphicsListComponent, ColdListComponent, BetComponent
  ],
  entryComponents: [DishesCreateComponent, DialogDataExampleDialog, DialogDataListDialog, DishesListComponent],
  bootstrap: [DishesCreateComponent],
  providers: [DatePipe]
})
export class AdminModule { }