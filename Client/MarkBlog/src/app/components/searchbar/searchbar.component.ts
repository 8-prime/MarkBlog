import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  @Input() initialValue: string = '';
  @Input() debounceTime = 300;

  @Output() textChange = new EventEmitter<string>();

  inputValue = new Subject<string>();
  trigger = this.inputValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );

  subscriptions: Subscription[] = [];

  constructor() {
  }

  ngOnInit() {
    const subscription = this.trigger.subscribe(currentValue => {
      console.log("Val Changed");
      this.textChange.emit(currentValue);
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onInput(e: any) {
    this.inputValue.next(e.target.value);
  }
}
