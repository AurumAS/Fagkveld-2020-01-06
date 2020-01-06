import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    @Input() title = 'aurum-fagkveld20200106';

    @Output() buttonClick = new EventEmitter<any>();
}
