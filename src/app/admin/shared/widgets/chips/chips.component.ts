import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ChipsService } from '../../../shared/widgets/services/chips.service'
/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})
export class ChipsComponent implements OnDestroy {
  messages: any[] = [];
  subscription: Subscription;
  category: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];

  @ViewChild('fruitInput',{static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto',{static: false}) matAutocomplete: MatAutocomplete;

  constructor(private chipsService: ChipsService) {
    this.subscription = this.chipsService.getMessage().subscribe(message => {
      this.category = message
      if (message) { 
        for(var i =0; i <= message.length -1 ; i++){
          this.messages.push(message[i]);
          // console.log(this.imagesArray)
        this.allFruits = this.messages
        }
      } else {
        // clear messages when empty message received
        this.messages = [];
      }  
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
    });


  
 
      }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
   // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
      this.messages.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.sendFilterData(this.fruits)
    }
  }
  sendFilterData(category): void {
    // send message to subscribers via observable subject
    if(category.length === 0){
      console.log(this.category)
      this.chipsService.sendCategory(this.category);
    } else {
      this.chipsService.sendCategory(category);
    }
    
}
  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.sendFilterData(this.fruits)
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
}
}
