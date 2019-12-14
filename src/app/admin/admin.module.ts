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
import { DishesListComponent } from './dish/dishes-list/dishes-list.component';
import { DishesCreateComponent } from './dish/dishes-create/dishes-create.component';
import { AnalysticListComponent } from './analystic/analystic-list/analystic-list.component';
import { EventListComponent } from './event/event-list/event-list.component';

import {MatCardModule} from '@angular/material/card';

import {MatPaginatorModule} from '@angular/material/paginator';

import {MatSelectModule} from '@angular/material/select';

import {MatTableModule} from '@angular/material/table';



@NgModule({
  imports: [
    ScrollingModule,
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    MatTableModule,
    
    MatCardModule,
    
    MatPaginatorModule,
    
    MatSelectModule,
    
    
    ],
  declarations: [
    AdminComponent,
    HeaderComponent,
    NavbarComponent,
    ProductsListComponent,
    ProductsCreateComponent,
    DishesListComponent,
    DishesCreateComponent,
    AnalysticListComponent,
    SearchPipe,
    EventListComponent
  ],
  providers: []
})
export class AdminModule { }