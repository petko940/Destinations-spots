import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(private authService: AuthService) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUsername(): string | null {
    return this.authService.getCurrentUsername();
  }

  logout() {
    this.authService.logout();
  }
}
