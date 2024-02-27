import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CreateDestinationService } from '../services/create-destination.service';


@Component({
    selector: 'app-create-destination',
    templateUrl: './create-destination.component.html',
    styleUrl: './create-destination.component.css'
})
export class CreateDestinationComponent implements OnInit {
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

    fg: FormGroup;
    searchInput: FormControl = new FormControl('');

    constructor(
        private createDestinationService: CreateDestinationService,
        private http: HttpClient
    ) {
        this.fg = new FormGroup({
            name: new FormControl(''),
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

        if (fileType !== 'image') {
            this.fg.get('photo')?.setErrors({ 'invalidImageFormat': true });
        }
    }

    searchLocation() {
        this.submitErrorMessage = '';

        // const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${this.fg.get('locationInput')?.value}`;
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
        const requestData = {
            name: this.fg.get('name')?.value,
            description: this.fg.get('description')?.value,
            latitude: this.latitude,
            longitude: this.longitude,
            location: this.selectedLocation.location,
        };

        this.createDestinationService.createDestination(requestData)
            .subscribe(response => {
                console.log(response);
                this.submitErrorMessage = '';
            }, error => {
                console.error('Error:', error);
                this.submitErrorMessage = 'An error occurred. Please try again later.';
            }
            );
    }
}
