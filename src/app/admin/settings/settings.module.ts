import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WorkerListComponent } from '../shared/workers/worker-list/worker-list.component';
import { SettingsComponent } from '../settings/settings.component'
import { SettingsRoutingModule } from '../settings/settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentComponent } from '../shared/equipment/equipment.component';
import { RestaurantsComponent } from '../shared/restaurants/restaurants.component';
import { ApiintegrationComponent } from './apiintegration/apiintegration.component';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    SettingsComponent,
    ApiintegrationComponent,
    WorkerListComponent,
    EquipmentComponent,
    RestaurantsComponent,
    ApiintegrationComponent
  ],
  entryComponents: [],
  bootstrap: [],
  providers: []
})
export class SettingsModule { }