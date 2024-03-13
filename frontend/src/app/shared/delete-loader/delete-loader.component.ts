import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete-loader',
  templateUrl: './delete-loader.component.html',
  styleUrl: './delete-loader.component.css'
})
export class DeleteLoaderComponent {
  @Input() deleteLoading: boolean = false;
}
