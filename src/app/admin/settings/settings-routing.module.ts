import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentComponent } from '../shared/equipment/equipment.component';
import { WorkerListComponent } from '../shared/workers/worker-list/worker-list.component';
import { SettingsComponent } from '../settings/settings.component'
import { AuthGuard } from '../../_helpers/auth.guard'
import { Role } from '../../_models/role';
import { RestaurantsComponent } from '../shared/restaurants/restaurants.component';
import { ApiintegrationComponent } from './apiintegration/apiintegration.component';

const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'worker',
        component: WorkerListComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'rest_api',
        component: ApiintegrationComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'restaurants',
        component: RestaurantsComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
      path: 'equipment',
      component: EquipmentComponent,
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'api',
        component: EquipmentComponent,
          data: { roles: [Role.Admin, Role.User] }
        },
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(settingsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule { }