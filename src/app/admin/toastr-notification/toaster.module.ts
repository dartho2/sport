import { NgModule } from '@angular/core';    
// import { BrowserModule } from '@angular/platform-browser';  
import { NotificationComponent} from './toastr-notification.component';    
import {NotificationService} from './toastr-notification.service';    

import { CommonModule } from '@angular/common';
@NgModule({    
    declarations: [    
        NotificationComponent    
    ],  
    imports:[  
        CommonModule,
        // BrowserModule  
    ],  
    exports: [    
        NotificationComponent    
    ],providers:[    
        NotificationService    
    ]    
})    
export class NotificationModule    
{    
}    