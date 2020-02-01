import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkerListComponent } from '../shared/workers/worker-list/worker-list.component';
import { SettingsComponent } from '../settings/settings.component'
import { AuthGuard } from '../../_helpers/auth.guard'
import { Role } from '../../_models/role';
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