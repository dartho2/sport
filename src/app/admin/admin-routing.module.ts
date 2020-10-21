import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

import { BetComponent } from '../admin/bet/bet-list/bet.component'
import { ProductShowComponent } from './products/products-show/product-show.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductsCreateComponent } from './products/products-create/products-create.component';
import { DishesListComponent } from './p-restaurant/p-storage/dish/dishes-list/dishes-list.component';
import { DishesCreateComponent } from './p-restaurant/p-storage/dish/dishes-create/dishes-create.component';
import { AnalysticListComponent } from './analystic/analystic-list/analystic-list.component';
import { RecipeListComponent } from './p-restaurant/p-storage//recipe/recipe-list/recipe-list.component';
import { SemiproduktListComponent } from './semiproduct/semiprodukt-list/semiprodukt-list.component';
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
import { StorageCreateComponent } from './p-restaurant/p-storage/storage-create/storage-create.component';
import { PProductsListComponent } from './p-restaurant/p-storage/products/p-products-list/p-products-list.component';
import { PProductsCreateComponent } from './p-restaurant/p-storage/products/p-products-create/p-products-create.component';
import { PProductsShowComponent } from './p-restaurant/p-storage/products/p-products-show/p-products-show.component';
import { DishShowComponent } from './p-restaurant/p-storage/dish/dish-show/dish-show.component';
import { RecipeCreateComponent } from './p-restaurant/p-storage/recipe/recipe-create/recipe-create.component';
import { RecipeShowComponent } from './p-restaurant/p-storage/recipe/recipe-show/recipe-show.component';

const adminRoutes: Routes = [

  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'restaurant',
        data: {
          roles: [Role.Admin, Role.User],
          breadcrumb: 'home'
        },
        children: [
          {
            path: '',
            component: HomeComponent,
            data: {
              roles: [Role.Admin, Role.User], breadcrumb: 'restauracja'
            }
          },
          {
            path: ':idRestaurant',
            data: {
              roles: [Role.Admin, Role.User], breadcrumb: 'restauracja'
            },
            children: [
              {
                path: '',
                component: PRestaurantComponent,
                data: { roles: [Role.Admin, Role.User], breadcrumb: 'GitHub2' }
              },
              {
                path: 'personel/:idPersonel',
                component: PersonelListComponent,
                data: { roles: [Role.Admin, Role.User], breadcrumb: 'Personel' }
              },
              {
                path: 'storage/:idStorage',
                data: { roles: [Role.Admin, Role.User], breadcrumb: 'magazyn' }, children: [

                  {
                    path: '',
                    component: StorageListComponent,
                    data: { roles: [Role.Admin, Role.User], breadcrumb: 'new' }
                  },
                  {
                    path: 'dish',
                    data: { roles: [Role.Admin, Role.User], breadcrumb: 'dish' },
                    children: [
                      {
                        path: '',
                        component: DishesListComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'new' }
                      },
                      {
                        path: 'new',
                        component: DishesCreateComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'new' }
                      },
                      {
                        path: 'edit/:idDishe',
                        component: DishesCreateComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'edit' }
                      },
                      {
                        path: 'show/:idDishe',
                        component: DishShowComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'show' }
                      }
                    ]
                  },
                  {
                    path: 'products',
                    data: { roles: [Role.Admin, Role.User], breadcrumb: 'products' },
                    children: [
                      {
                        path: '',
                        component: PProductsListComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'products' }
                      },
                      {
                        path: 'new',
                        component: PProductsCreateComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'new' }
                      },
                      {
                        path: 'edit/:idProduct',
                        component: PProductsCreateComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'edit' }
                      },
                      {
                        path: 'show/:idProduct',
                        component: PProductsShowComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'show' }
                      }
                    ]
                  },
                  {
                    path: 'recipe/:idRecipe',
                    canActivate: [AuthGuard],
                    data: { roles: [Role.Admin, Role.User] , breadcrumb: 'recipe' },
                    children: [
                      {
                        path: '',
                        component: RecipeListComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'products' }
                      },
                      {
                        path: 'new',
                        component: RecipeCreateComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'new' }
                      },
                      {
                        path: 'edit/:idRecipeitems',
                        component: RecipeCreateComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'edit' }
                      },
                      {
                        path: 'show/:idRecipeitems',
                        component: RecipeShowComponent,
                        data: { roles: [Role.Admin, Role.User], breadcrumb: 'show' }
                      }
                    ]
            
                  },
                  {
                    path: 'semiproduct/list',
                    component: SemiproduktListComponent,
                    data: { roles: [Role.Admin, Role.User] }
                  },
                 
                ]
              },

              {
                path: 'graphic/:idPersonel',
                component: GraphicListComponent,
                data: { roles: [Role.Admin, Role.User] }
              }]
          },
        ]
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
      // {
      //   path: 'settings',
      //   loadChildren: './settings/settings.module#SettingsModule',
      //   canActivate: [AuthGuard],
      //   data: { roles: [Role.Admin, Role.User] }
      // },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin , Role.User] }
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
      // {
      //   path: 'graphics/list',
      //   component: GraphicsListComponent,
      //   data: { roles: [Role.Admin, Role.User] }
      // },
      
      {
        path: 'products/edit/:idProduct',
        component: ProductsCreateComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
      }
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