import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { SearchService } from '../../search/search.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css'
})
export class NavigationComponent {
    searchText: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private searchService: SearchService,
    ) { }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    getCurrentUsername(): string | null {
        return this.authService.getCurrentUsername();
    }

    searchResults() {
        this.searchText = this.searchText.trim();
        if (this.searchText === '') {
            return;
        }
        this.searchService.searchValue = this.searchText;
        this.router.navigate(['/search', this.searchText]);
        this.searchText = '';
    }

    logout() {
        this.authService.logout();
    }
}
