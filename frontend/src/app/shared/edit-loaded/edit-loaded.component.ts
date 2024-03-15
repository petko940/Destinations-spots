import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-loaded',
  templateUrl: './edit-loaded.component.html',
  styleUrl: './edit-loaded.component.css'
})
export class EditLoadedComponent {
  @Input() loading: boolean = false;
}
