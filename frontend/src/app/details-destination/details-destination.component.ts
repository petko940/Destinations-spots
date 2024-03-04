import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Destination } from '../types/destination';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { Rating } from '../types/rating';
import { AuthenticationService } from '../services/authentication.service';


@Component({
    selector: 'app-details-destination',
    templateUrl: './details-destination.component.html',
    styleUrl: './details-destination.component.css'
})
export class DetailsDestinationComponent implements OnInit {
    isLoading: boolean = true
    destination!: Destination;
    map!: Map;
    markerOverlay!: Overlay;
    rating!: number[];
    remainingStars!: number[];
    destinationId!: number;
    allRatings!: Rating[];

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.destinationId = Number(params['id']);
            this.http.get<Destination>('http://127.0.0.1:8000/api/destination/' + this.destinationId)
                .subscribe(data => {
                    this.isLoading = false;
                    this.destination = data;

                    this.loadRating();

                    setTimeout(() => {
                        this.showMap()
                    });

                }, error => {
                    console.log(error);
                    this.isLoading = false
                });
        });
    }

    showMap() {
        this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [this.destination.longitude, this.destination.latitude],
                zoom: 12,
                projection: 'EPSG:4326'
            })
        });

        this.markerOverlay = new Overlay({
            positioning: 'center-center',
            element: document.createElement('div'),
        });
        this.map.addOverlay(this.markerOverlay);

        const attribution = document.getElementsByClassName('ol-attribution')[0];
        if (attribution) {
            attribution.innerHTML = '';
        }

        this.markerOverlay.setPosition([this.destination.longitude, this.destination.latitude]);
        if (this.markerOverlay) {
            const markerElement = this.markerOverlay.getElement();
            if (markerElement) {
                markerElement.innerHTML = '<i class="fa-solid fa-location-dot text-2xl text-red-700"></i>';
            }
        }
    }

    loadRating(): void {
        this.http.get<Rating[]>('http://127.0.0.1:8000/api/destination/' + this.destinationId + '/rating')
            .subscribe(ratingData => {
                this.allRatings = ratingData;
                
                const sumStars = ratingData.reduce((sum, rating) => sum + rating.stars, 0);
                const averageStars = sumStars / ratingData.length;
                
                this.rating = Array(Math.floor(averageStars)).fill(0);
                this.remainingStars = Array(5 - Math.floor(averageStars)).fill(0);

            }, error => {
                console.log(error);
            });
    }

    updateRating(rating: number): void {
        const destinationId = this.destination.id;
        const userId = this.authenticationService.getCurrentUser();

        if (!userId) {
            console.error('User ID not available.');
            return;
        }

        const payload = {
            stars: rating,
            user: userId
        };

        this.http.post<Rating[]>('http://127.0.0.1:8000/api/destination/' + destinationId + '/rating', payload)
            .subscribe(response => {                
                const userExists = this.allRatings.some(rating => rating.user === userId);
                
                let newRatingLength 
                if (!userExists) {
                    newRatingLength = this.rating.length + 1;
                } else {
                    newRatingLength = this.rating.length
                }

                const sumStars = this.rating.reduce((sum, _) => sum + 1, rating);
                const averageStars = sumStars / newRatingLength;
                                
                this.rating = Array(Math.floor(averageStars)).fill(0);
                this.remainingStars = Array(5 - Math.floor(averageStars)).fill(0);

            }, error => {
                console.error('Error updating rating:', error);
            });
    }

}
