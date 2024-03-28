import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { ActivatedRoute } from '@angular/router';
import { Destination } from '../types/destination';
import { User } from '../types/user';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
    isLoading: boolean = true;

    searchText: string = '';

    foundDestinations!: Destination[];
    isFoundDestinations: boolean = false;

    foundUsers!: User[];
    isFoundUsers: boolean = false;

    constructor(
        private searchService: SearchService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.isLoading = false;
            if (params['text']) {
                this.searchService.searchValue = params['text'];
                this.searchText = params['text'];
                this.search();
            }
        }, error => {
            this.isLoading = false;
            console.log(error);
        });
    }

    search() {
        this.searchService.search(this.searchService.searchValue)
            .subscribe((result: any) => {
                this.foundDestinations = result['destinations'];
                this.isFoundDestinations = this.foundDestinations.length > 0 ? true : false;
                this.foundUsers = result['users'];
                this.isFoundUsers = this.foundUsers.length > 0 ? true : false;

            }, error => {
                console.log(error);
            })
    }

}
