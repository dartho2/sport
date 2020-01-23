import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const routes: Routes = [
    // {
    //     path: '',
    //     component: LoginComponent,
    //     canActivate: [AuthGuard]
    // },
    {
        path: '',
        loadChildren: './admin/admin.module#AdminModule',
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'login',
        component: LoginComponent
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
