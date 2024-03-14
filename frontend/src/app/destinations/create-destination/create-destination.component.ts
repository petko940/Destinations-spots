import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CreateDestinationService } from '../services/create-destination.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';


@Component({
    selector: 'app-create-destination',
    templateUrl: './create-destination.component.html',
    styleUrl: './create-destination.component.css'
})
export class CreateDestinationComponent implements OnInit {
    isLoading: boolean = false;

    map!: Map;
    markerOverlay!: Overlay;

    latitude: number;
    longitude: number;
    selectedLocation: any = {};

    photo: File | null = null;
    selectedImage: string | ArrayBuffer | null = null;

    submitErrorMessage: string = "";
    imagesErrorMessage: string = "";

    fg: FormGroup;
    searchInput: FormControl = new FormControl('');

    currentUser: any;

    constructor(
        private createDestinationService: CreateDestinationService,
        private router: Router,
        private authService: AuthService,
    ) {
        this.fg = new FormGroup({
            name: new FormControl('123', [Validators.required, Validators.minLength(3)]),
            description: new FormControl('asdqwerzxdfasedweqe qwe', [Validators.required, Validators.minLength(10)]),
            photo: new FormControl(''),
            latitude: new FormControl(''),
            longitude: new FormControl(''),
            location: new FormControl(''),
            selectedLocation: new FormControl(''),
            locationInput: new FormControl('')
        });

        this.latitude = this.fg.get('latitude')?.value;
        this.longitude = this.fg.get('longitude')?.value;

        this.currentUser = this.authService.getCurrentUserId();

    }

    ngOnInit() {
        this.initMap();

        this.fg.get('locationInput')?.valueChanges
            .pipe(debounceTime(1000))
            .subscribe(() => {
                this.searchLocation();
            });
    }

    initMap() {
        setTimeout(() => {
            this.map = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: [25.5, 42.8],
                    zoom: 6.9,
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
                attribution.innerHTML = "";
            }

            this.map.on('click', (event) => {
                this.isLoading = true;
                const clickedCoordinate = event.coordinate;

                this.longitude = clickedCoordinate[0];
                this.latitude = clickedCoordinate[1];

                this.markerOverlay.setPosition(clickedCoordinate);
                if (this.markerOverlay) {
                    const markerElement = this.markerOverlay.getElement();
                    if (markerElement) {
                        markerElement.innerHTML = '<i class="fa-solid fa-location-dot text-2xl text-red-700"></i>';
                    }
                }

                this.submitErrorMessage = '';

                this.createDestinationService.getLocationCoordinates(this.latitude, this.longitude)
                    .subscribe((response: any) => {
                        this.isLoading = false;
                        const location = this.createDestinationService.formatLocation(response);
                        this.selectedLocation = {
                            latitude: this.latitude,
                            longitude: this.longitude,
                            location: location
                        };
                    },
                        error => {
                            console.error('Error:', error);
                        });
            });
        })
    }

    onFileSelected(event: any) {
        const file: File | null = event.target.files[0];

        if (file) {
            this.fg.get('photo')?.setValue(file);
            const fileType: string = file.type.split('/')[0];

            const image: File = this.fg.get('photo')?.value;
            if (fileType !== 'image') {
                this.selectedImage = null;
                this.fg.get('photo')?.setErrors({ 'invalidImageFormat': true });
                this.imagesErrorMessage = 'Invalid image format. Please upload an image file.';
                return;
            }

            const maxImageSize = 5 * 1024 * 1024;
            if (image.size > maxImageSize) {
                this.selectedImage = null;
                this.fg.get('photo')?.setErrors({ 'invalidImageSize': true });
                this.imagesErrorMessage = 'Image size is too large. Please upload an image with a size less than 5MB.';
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.selectedImage = reader.result;
            };
        } else {
            this.selectedImage = null;
        }

    }

    searchLocation() {
        this.submitErrorMessage = '';

        this.createDestinationService.searchLocation(this.fg.get('locationInput')?.value)
            .subscribe((response: any) => {
                if (response && response.length > 0) {
                    const result = response[0];

                    this.latitude = parseFloat(result.lat);
                    this.longitude = parseFloat(result.lon);

                    this.map.getView().animate({
                        center: [this.longitude, this.latitude],
                        zoom: 11,
                        duration: 1000
                    });

                    this.selectedLocation = {
                        latitude: this.latitude,
                        longitude: this.longitude,
                    };

                } else {
                    this.selectedLocation = {
                        location: 'Unknown! Choose another location!'
                    }
                }
            }, error => {
                console.error('Error:', error);
            });
    }

    isButtonDisabled(): boolean {
        return !this.selectedLocation.location || this.selectedLocation.location === 'Unknown! Choose another location!';
    }

    onSubmit() {
        this.isLoading = true;

        if (!this.selectedImage) {
            const noImageAvailable = './assets/no-image-available.jpg'
            this.selectedImage = noImageAvailable;
        }

        const formData = new FormData();
        formData.append('name', this.fg.get('name')?.value);
        formData.append('description', this.fg.get('description')?.value);
        formData.append('latitude', String(this.latitude));
        formData.append('longitude', String(this.longitude));
        formData.append('location', this.selectedLocation.location);
        formData.append('photo', this.fg.get('photo')?.value);
        formData.append('user', this.currentUser);

        this.createDestinationService.createDestination(formData)
            .subscribe(response => {
                this.submitErrorMessage = '';
                this.isLoading = false;
                this.router.navigate(['/']);
            }, error => {
                console.error('Error:', error);
                this.submitErrorMessage = 'An error occurred. Please try again.';
                this.isLoading = false;
            });
    }
}
