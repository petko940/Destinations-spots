import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
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
            if (params['text']) {
                this.searchService.searchValue = params['text'];
                this.search();
            }
        });
    }

    search() {
        this.searchService.searchUser(this.searchService.searchValue)
            .subscribe((result: any) => {
                this.foundDestinations = result['destinations'];
                this.isFoundDestinations = this.foundDestinations.length > 0 ? true : false;
                this.foundUsers = result['users'];
                this.isFoundUsers = this.foundUsers.length > 0 ? true : false;

            })
    }

}
