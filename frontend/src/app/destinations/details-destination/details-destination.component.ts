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
import { RatingService } from '../services/rating.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDestinationComponent } from '../delete-destination/delete-destination.component';
import { DetailsDestinationService } from '../services/details-destination.service';
import { CommentsService } from '../services/comments.service';


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

    addCommentForm: FormGroup;
    nameCharsCount: number = 0;
    commentCharsCount: number = 0;

    submitErrorMessage: string = '';

    username!: string;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private ratingService: RatingService,
        private fb: FormBuilder,
        private matDialog: MatDialog,
        private detailsDestinationService: DetailsDestinationService,
        private commentService: CommentsService,
    ) {
        this.addCommentForm = this.fb.group({
            name: ['', Validators.required],
            comment: ['', Validators.required],
        });

        this.username = this.authService.getCurrentUsername() || '';
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.destinationId = Number(params['id']);
            this.detailsDestinationService.destinationId = this.destinationId;

            this.detailsDestinationService.fetchDestination(this.destinationId)
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
        const userId = this.authService.getCurrentUserId();

        if (!userId) {
            console.error('User ID not available.');
            return;
        }

        const existingRating = this.allRatings.find(r => r.user.toString() === userId);

        if (existingRating && existingRating.stars === rating) {
            this.ratingService.deleteRating(this.destinationId, Number(userId))
                .subscribe(() => {
                    this.fetchRating();
                }, error => {
                    console.error('Error deleting rating:', error);
                });
        } else {
            const payload = {
                stars: rating,
                user: userId
            };
            this.ratingService.postRating(this.destinationId, payload)
                .subscribe(() => {
                    this.fetchRating();
                }, error => {
                    console.error('Error updating rating:', error);
                });
        }
    }

    fetchComments(): void {
        this.commentService.fetchComments(this.destinationId)
            .subscribe(commentData => {
                this.comments = commentData.reverse();

            }, error => {
                console.log(error);
            })
    }

    addComment(): void {
        const payload = {
            destination: this.destinationId,
            name: this.addCommentForm.value.name,
            comment: this.addCommentForm.value.comment,
        }

        this.commentService.postComment(this.destinationId, payload)
            .subscribe(() => {
                this.addCommentForm.reset();
                this.nameCharsCount = 0;
                this.commentCharsCount = 0;
                this.fetchComments();

                this.submitErrorMessage = '';
            }, error => {
                console.log(error);
                this.submitErrorMessage = 'An error occurred. Please try again.';
            });
    }

    charactersCount(field: string): void {
        if (field === 'name') {
            this.nameCharsCount = this.addCommentForm.value.name.length;
        } else if (field === 'comment') {
            this.commentCharsCount = this.addCommentForm.value.comment.length;
        }
    }

    openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
        this.matDialog.open(DeleteDestinationComponent, {
            width: '700px',
            height: '300px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
        });
    }

}
