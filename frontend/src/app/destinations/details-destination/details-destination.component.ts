import { Component, OnInit } from '@angular/core';
import { Destination } from '../../types/destination';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { Rating } from '../../types/rating';
import { Comment } from '../../types/comment';
import { AuthenticationService } from '../../services/authentication.service';
import { RatingService } from '../services/rating.service';


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
    allRatingsCount!: number;
    averageRating!: number;

    comments: Comment[] = [];

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private ratingService: RatingService,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.destinationId = Number(params['id']);
            this.http.get<Destination>('http://127.0.0.1:8000/api/destination/' + this.destinationId)
                .subscribe(data => {
                    this.isLoading = false;
                    this.destination = data;

                    this.fetchRating();
                    this.fetchComments();

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

    fetchRating(): void {
        this.ratingService.fetchRating(this.destinationId)
            .subscribe(ratingData => {
                this.allRatings = ratingData;
                this.allRatingsCount = this.allRatings.length;

                const sumStars = this.allRatings.reduce((sum, rating) => sum + rating.stars, 0);
                this.averageRating = sumStars / this.allRatings.length;

                if (!this.averageRating) {
                    this.averageRating = 0;
                    this.rating = Array(0).fill(0);
                    this.remainingStars = Array(5).fill(0);
                } else {
                    this.rating = Array(Math.round(this.averageRating)).fill(0);
                    this.remainingStars = Array(5 - Math.round(this.averageRating)).fill(0);
                }

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

        const existingRating = this.allRatings.find(r => r.user === userId['id']);

        if (existingRating && existingRating.stars === rating) {
            this.http.delete(`http://127.0.0.1:8000/api/destination/${destinationId}/rating/delete?user=${userId.id}`)
                .subscribe(response => {
                    this.fetchRating();
                }, error => {
                    console.error('Error deleting rating:', error);
                });
        } else {
            const payload = {
                stars: rating,
                user: userId
            };
            this.http.post<Rating[]>('http://127.0.0.1:8000/api/destination/' + destinationId + '/rating/', payload)
                .subscribe(response => {
                    this.fetchRating();
                }, error => {
                    console.error('Error updating rating:', error);
                });
        }
    }

    fetchComments(): void {
        this.http.get<Comment[]>('http://127.0.0.1:8000/api/destination/' + this.destinationId + '/comments/')
            .subscribe(commentData => {
               this.comments = commentData;
               console.log(this.comments);
               
            }, error => {
                console.log(error);
            })
    }

}
