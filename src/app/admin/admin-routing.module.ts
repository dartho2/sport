import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

import { ProductShowComponent } from './products/products-show/product-show.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductsCreateComponent } from './products/products-create/products-create.component';
import { DishesListComponent } from './dish/dishes-list/dishes-list.component';
import { DishesCreateComponent } from './dish/dishes-create/dishes-create.component';
import { AnalysticListComponent } from './analystic/analystic-list/analystic-list.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { SemiproduktListComponent } from './semiproduct/semiprodukt-list/semiprodukt-list.component';
import { GraphicsListComponent } from './graphics/graphics-list/graphics-list.component';
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
        path: 'products/show/:idProduct',
        component: ProductShowComponent
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
        path: 'graphics/list',
        component: GraphicsListComponent
      },
      {
        path: 'semiproduct/list',
        component: SemiproduktListComponent
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
      {
        path: 'dish/edit/:id',
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