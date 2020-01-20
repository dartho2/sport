import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductsCreateComponent } from './products/products-create/products-create.component';
import { DishesListComponent } from './dish/dishes-list/dishes-list.component';
import { DishesCreateComponent } from './dish/dishes-create/dishes-create.component';
import { AnalysticListComponent } from './analystic/analystic-list/analystic-list.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'products',
        component: ProductsListComponent
      },
      {
        path: 'products/create',
        component: ProductsCreateComponent
      },
      {
        path: 'analystic/list',
        component: AnalysticListComponent
      },
      {
        path: 'recipe/list',
        component: RecipeListComponent
      },
      {
        path: 'products/edit/:idProduct',
        component: ProductsCreateComponent
      },
      {
        path: 'dish',
        component: DishesListComponent
      },
      {
        path: 'dish/create',
        component: DishesCreateComponent
      },
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }