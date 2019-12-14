import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from './_guards/auth.guard';
const routes: Routes = [

    
    { path: '', loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})

export class AppRoutingModule {}