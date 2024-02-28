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
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';


@Component({
    selector: 'app-create-destination',
    templateUrl: './create-destination.component.html',
    styleUrl: './create-destination.component.css'
})
export class CreateDestinationComponent implements OnInit {
    isLoading: boolean = false;

    map!: Map;
    markerOverlay!: Overlay;

    // name: string = "";
    // description: string = "";
    latitude: number | undefined;
    longitude: number | undefined;
    selectedLocation: any = {};
    photo: File | null = null;
    // fileTypeErrorMessage: string = "";
    // locationInput: string = "";

    submitErrorMessage: string = "";
    imagesErrorMessage: string = "";

    fg: FormGroup;
    searchInput: FormControl = new FormControl('');

    currentUser: any;

    constructor(
        private createDestinationService: CreateDestinationService,
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
        this.fg = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3)]),
            description: new FormControl('Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nostrum totam animi excepturi repellat dicta, deserunt quisquam quod! Officiis possimus voluptate eligendi rem ut minus aspernatur saepe, vero quod laboriosam?'),
            photo: new FormControl(''),
            latitude: new FormControl(''),
            longitude: new FormControl(''),
            location: new FormControl(''),
            selectedLocation: new FormControl(''),
            locationInput: new FormControl('')
        });

        this.latitude = this.fg.get('latitude')?.value;
        this.longitude = this.fg.get('longitude')?.value;

        this.currentUser = this.authenticationService.getCurrentUser();
    }

    ngOnInit() {
        this.initMap();

        this.fg.get('locationInput')?.valueChanges
            .pipe(debounceTime(1000))
            .subscribe(() => {
                this.searchLocation();
            });
    }

    private initMap() {
        this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [25.5, 42.8],
                zoom: 7.5,
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
            const clickedCoordinate = event.coordinate;
            const lon = clickedCoordinate[0];
            const lat = clickedCoordinate[1];

            this.latitude = lat;
            this.longitude = lon;

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
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        this.fg.get('photo')?.setValue(file);
        const fileType = file.type.split('/')[0];

        const image: File = this.fg.get('photo')?.value;
        const maxImageSize = 5 * 1024 * 1024;
        if (fileType !== 'image') {
            this.fg.get('photo')?.setErrors({ 'invalidImageFormat': true });
            this.imagesErrorMessage = 'Invalid image format. Please upload an image file.';
            return;
        }
        if (image.size > maxImageSize) {
            this.fg.get('photo')?.setErrors({ 'invalidImageSize': true });
            this.imagesErrorMessage = 'Image size is too large. Please upload an image with a size less than 5MB.';
            return;
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

    // isButtonDisabled(): boolean {
    //     return !this.selectedLocation.location || this.selectedLocation.location === 'Unknown! Choose another location!';
    // }

    onSubmit() {
        this.isLoading = true;

        // console.log(this.latitude);
        // console.log(this.fg.get('longitude')?.value);
        // console.log(this.fg.get('longitude')?.value);
        // console.log(this.currentUser);

        // const requestData = {
        //     name: this.fg.get('name')?.value,
        //     description: this.fg.get('description')?.value,
        //     photo: this.fg.get('photo')?.value,
        //     latitude: this.latitude,
        //     longitude: this.longitude,
        //     location: this.selectedLocation.location,
        //     user: this.currentUser.id,
        // };
        // console.log(requestData);
        // const image: File = this.fg.get('photo')?.value;
        // // const maxImageSize = 5 * 1024 * 1024;
        // const maxImageSize: number = 1 * 1024 * 1024;
        // if (image.size > maxImageSize) {
        //     this.fg.get('photo')?.setErrors({ 'invalidImageSize': true });
        //     this.submitErrorMessage = 'Image size is too large. Please upload an image with a size less than 5MB.';
        //     return;
        // }


        const formData = new FormData();
        formData.append('name', this.fg.get('name')?.value);
        formData.append('description', this.fg.get('description')?.value);
        formData.append('latitude', String(this.latitude));
        formData.append('longitude', String(this.longitude));
        formData.append('location', this.selectedLocation.location);
        formData.append('user', this.currentUser.id);
        formData.append('photo', this.fg.get('photo')?.value);

        this.createDestinationService.createDestination(formData)
            .subscribe(response => {
                console.log(response);
                this.submitErrorMessage = '';
                this.isLoading = false;
                // this.router.navigate(['/']);
            }, error => {
                console.error('Error:', error);
                this.submitErrorMessage = 'An error occurred. Please try again.';
                this.isLoading = false;
            });
    }
}
