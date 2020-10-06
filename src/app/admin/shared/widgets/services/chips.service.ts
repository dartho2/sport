import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChipsService {
    private subject = new Subject<any>();
    private subject1 = new Subject<any>();
    sendMessage(message: any) {
       
            this.subject.next(message);
       
    }

    clearMessages() {
        this.subject.next();
        this.subject1.next();
    }
    sendCategory(category:any){
        this.clearMessages()
        this.subject1.next(category);
    }
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    getCategory(): Observable<any> {
        return this.subject1.asObservable();
    }
}