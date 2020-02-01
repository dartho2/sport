import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {NotificationModule } from '../toastr-notification/toaster.module';
import { WorkerListComponent } from '../shared/workers/worker-list/worker-list.component';
import { SettingsComponent } from '../settings/settings.component'
import { SettingsRoutingModule } from '../settings/settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    NotificationModule,
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    SettingsComponent,
    WorkerListComponent
  ],
  entryComponents: [],
  bootstrap: [],
  providers: []
})
export class SettingsModule { }