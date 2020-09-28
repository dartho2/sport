import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

import { BetComponent } from '../admin/bet/bet-list/bet.component'
import { ProductShowComponent } from './products/products-show/product-show.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductsCreateComponent } from './products/products-create/products-create.component';
import { DishesListComponent } from './dish/dishes-list/dishes-list.component';
import { DishesCreateComponent } from './dish/dishes-create/dishes-create.component';
import { AnalysticListComponent } from './analystic/analystic-list/analystic-list.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { SemiproduktListComponent } from './semiproduct/semiprodukt-list/semiprodukt-list.component';
import { GraphicsListComponent } from './graphics/graphics-list/graphics-list.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { Role } from '../_models/role';
import { CalendarComponent } from './calendar/calendar.component';
import { NavbarSportComponent } from '../layout/sport/navbar-sport/navbar-sport.component';
import { LayoutComponent } from '../layout/sport/layout/layout.component';
import { HomeComponent } from './home/home.component';
import { PRestaurantComponent } from './p-restaurant/p-restaurant.component';
import { PersonelListComponent } from './p-restaurant/p-personel/personel-list/personel-list.component';
import { GraphicListComponent } from './p-restaurant/p-graphics/graphic-list/graphic-list.component';
import { StorageListComponent } from './p-restaurant/p-storage/storage-list/storage-list.component';

const adminRoutes: Routes = [

  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { roles: [Role.Admin, Role.User] ,breadcrumb: 'About' }
      },
      {
        path: 'restaurant/:idRestaurant',
        data: { roles: [Role.Admin, Role.User] },
        children: [
          {path: '',
          component: PRestaurantComponent,
          data: { roles: [Role.Admin, Role.User] , title: 'New', breadcrumb: [
            {
              label: 'Page1',
              url: ''
            }
          ]}
        },
          {
            path: 'personel/:idPersonel',
            component: PersonelListComponent,
            data: { roles: [Role.Admin, Role.User] ,breadcrumb: 'sdasdad'}
          },
          {
            path: 'storage',
            component: StorageListComponent,
            data: { roles: [Role.Admin, Role.User],breadcrumb: 'sadasd' }
          },
          {
            path: 'graphic',
            component: GraphicListComponent,
            data: { roles: [Role.Admin, Role.User] }
          }]
      },
      {
        path: 'restaurant/:idRestaurant/grafik/:idEWorker',
        component: PRestaurantComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'restaurant/:idRestaurant/storage/:idStorage',
        component: PRestaurantComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'restaurant/:idRestaurant/employee/:idEmployee',
        component: PRestaurantComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule',
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'products',
        component: ProductsListComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'products/create',
        component: ProductsCreateComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'products/show/:idProduct',
        component: ProductShowComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
      },
      {
              path: 'recipe/list',
              component: RecipeListComponent,
              canActivate: [AuthGuard],
              data: { roles: [Role.Admin, Role.User] }
      
            },
            {
              path: 'graphics/list',
              component: GraphicsListComponent,
              data: { roles: [Role.Admin, Role.User] }
            },
            {
              path: 'semiproduct/list',
              component: SemiproduktListComponent,
              data: { roles: [Role.Admin, Role.User] }
            },
            {
              path: 'products/edit/:idProduct',
              component: ProductsCreateComponent,
              canActivate: [AuthGuard],
              data: { roles: [Role.Admin] }
            },
            {
              path: 'dish',
              component: DishesListComponent,
              data: { roles: [Role.Admin, Role.User] }
            },
            {
              path: 'dish/create',
              component: DishesCreateComponent,
              data: { roles: [Role.Admin, Role.User] }
            },
            {
              path: 'dish/edit/:id',
              component: DishesCreateComponent,
              canActivate: [AuthGuard],
              data: { roles: [Role.Admin] }
            },
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'analystic/list',
        component: AnalysticListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin], state: 'anal' },

      },
      {
        path: 'analystic/list/:data',
        component: AnalysticListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'bet',
        component: BetComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'bet/:date',
        component: BetComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'bet/:date/:id',
        component: BetComponent,
        data: { roles: [Role.Admin, Role.User] }
      }
      
    ]
  }
]
// breadcrumbService.set('mentor', 'Enabler');

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }