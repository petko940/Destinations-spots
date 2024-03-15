import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDestinationService } from '../services/edit-destination.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { CreateDestinationService } from '../services/create-destination.service';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-edit-destination',
    templateUrl: './edit-destination.component.html',
    styleUrl: './edit-destination.component.css'
})
export class EditDestinationComponent {
    isLoading: boolean = true;
    editLoading: boolean = false;

    map!: Map;
    markerOverlay!: Overlay;
    latitude!: number;
    longitude!: number;
    selectedLocation: any = {};

    photo: File | null = null;
    selectedImage: string | ArrayBuffer | null = null;

    destinationId!: number;
    currentDestination!: any;
    
    destinationForm: FormGroup;

    currentUser: any;

    submitErrorMessage: string = "";
    imagesErrorMessage: string = "";


    constructor(
        private editDestinationService: EditDestinationService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private createDestinationService: CreateDestinationService,
        private authService: AuthService,
        private router: Router,
    ) {
        this.destinationForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            photo: [''],
            latitude: [''],
            longitude: [''],
            location: [''],
            selectedLocation: [''],
            locationInput: ['']
        });

        this.currentUser = this.authService.getCurrentUserId();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.destinationId = params['id'];
            this.fetchDestination();
        });

        // TODO: fix this
        this.destinationForm.get('locationInput')?.valueChanges
            .pipe(debounceTime(1000))
            .subscribe(() => {
                this.searchLocation();
            });
    }

    fetchDestination() {
        this.editDestinationService.fetchDestinationData(this.destinationId)
            .subscribe(data => {
                this.isLoading = false;
                this.currentDestination = data;
                this.populateForm();
                this.initMap();
                this.selectedLocation.location = this.currentDestination.location;
            }, error => {
                this.isLoading = false;
                console.log(error);
            })
    }

    populateForm() {
        this.destinationForm.patchValue({
            name: this.currentDestination.name,
            description: this.currentDestination.description,
            // photo: this.currentDestination.photo,
            latitude: this.currentDestination.latitude,
            longitude: this.currentDestination.longitude,
            location: this.currentDestination.location,
            selectedLocation: this.currentDestination.location,
        });
    }

    initMap() {
        this.longitude = this.currentDestination.longitude;
        this.latitude = this.currentDestination.latitude;

        this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [this.longitude, this.latitude],
                zoom: 11,
                projection: 'EPSG:4326'
            })
        });

        this.markerOverlay = new Overlay({
            positioning: 'center-center',
            element: document.createElement('div'),
        });
        this.map.addOverlay(this.markerOverlay);

        this.markerOverlay.setPosition([this.currentDestination.longitude, this.currentDestination.latitude]);
        if (this.markerOverlay) {
            const markerElement = this.markerOverlay.getElement();
            if (markerElement) {
                markerElement.innerHTML = '<i class="fa-solid fa-location-dot text-2xl text-red-700"></i>';
            }
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
    }

    searchLocation() {
        this.submitErrorMessage = '';
        let markerElement;
        this.createDestinationService.searchLocation(this.destinationForm.get('locationInput')?.value)
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
                    
                    this.markerOverlay.setPosition([this.longitude, this.latitude]);
                    if (this.markerOverlay) {
                        markerElement = this.markerOverlay.getElement();
                        if (markerElement) {
                            markerElement.innerHTML = '<i class="fa-solid fa-location-dot text-2xl text-red-700"></i>';
                        }
                    }
                    this.selectedLocation = {
                        latitude: this.latitude,
                        longitude: this.longitude,
                        location: result.display_name
                    }

                } else {
                    markerElement = this.markerOverlay.getElement();
                    if (markerElement) {
                        markerElement.innerHTML = '';
                    } 
                    this.selectedLocation = {
                        location: 'Unknown! Choose another location!'
                    }
                }
            }, error => {
                console.error('Error:', error);
            });
    }

    onFileSelected(event: any) {
        const file: File | null = event.target.files[0];

        if (file) {
            this.destinationForm.get('photo')?.setValue(file);
            const fileType: string = file.type.split('/')[0];

            const image: File = this.destinationForm.get('photo')?.value;
            if (fileType !== 'image') {
                this.selectedImage = null;
                this.destinationForm.get('photo')?.setErrors({ 'invalidImageFormat': true });
                this.imagesErrorMessage = 'Invalid image format. Please upload an image file.';
                return;
            }

            const maxImageSize = 5 * 1024 * 1024;
            if (image.size > maxImageSize) {
                this.selectedImage = null;
                this.destinationForm.get('photo')?.setErrors({ 'invalidImageSize': true });
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

    onSubmit() {
        if (this.destinationForm.invalid) {
            return;
        }

        const formData = new FormData();
        formData.append('name', this.destinationForm.get('name')?.value);
        formData.append('description', this.destinationForm.get('description')?.value);
        formData.append('latitude', String(this.latitude));
        formData.append('longitude', String(this.longitude));
        formData.append('location', this.selectedLocation.location);
        formData.append('user', this.currentUser);

        if (!this.selectedImage) {
            const noImageAvailable = './assets/no-image-available.jpg'
            this.selectedImage = noImageAvailable;
            formData.append('photo', '');
        } else {
            formData.append('photo', this.destinationForm.get('photo')?.value);
        }

        this.editDestinationService.updateDestination(this.destinationId, formData)
            .subscribe(response => {
                this.editLoading = true;

                setTimeout(() => {
                    this.router.navigate(['destination', this.destinationId]);
                }, 3000)
            }, error => {
                console.error('Error:', error);
            })
    }

}