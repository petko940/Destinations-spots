import { Component } from '@angular/core';

@Component({
    selector: 'app-create-destination',
    templateUrl: './create-destination.component.html',
    styleUrl: './create-destination.component.css'
})
export class CreateDestinationComponent {
    map!: Map;
    markerOverlay!: Overlay;

    latitude: number | undefined;
    longitude: number | undefined;
    selectedLocation: any = {};

    locationInput: string = "";

    errorMessage: string = "";

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.initMap();
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
                center: [25, 43],
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
                    markerElement.innerHTML = '<i class="fa-solid fa-location-dot" style="color: red;font-size: 30px"></i>';
                }
            }
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${this.latitude}&lon=${this.longitude}&format=json`;
            this.http.get(apiUrl)
                .subscribe((response: any) => {
                    let location = '';

                    if (response.address) {
                        if (response.address.village) {
                            location = `${response.address.village}, ${response.address.county}`;
                        } else if (response.address.town) {
                            location = `${response.address.town}, ${response.address.county}`;
                        } else if (response.address.suburb) {
                            location = `${response.address.suburb}, ${response.address.county}`;
                        } else if (response.address.hamlet) {
                            location = `${response.address.hamlet}, ${response.address.county}`;
                        } else if (response.address.county) {
                            location = `${response.address.county}`;
                        }
                        location += `, ${response.address.country}`

                    } else {
                        location = 'Unknown! Choose another location!';
                    }

                    this.selectedLocation = {
                        latitude: this.latitude,
                        longitude: this.longitude,
                        location,
                    };
                    console.log(this.selectedLocation['location']);

                }, error => {
                    console.error('Error:', error);
                })
        });
    }

    searchLocation() {
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${this.locationInput}`;
        this.http.get(apiUrl)
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

    sendLocationToDjango() {
        this.http.post('http://127.0.0.1:8000/api/coordinates/', this.selectedLocation)
            .subscribe(response => {
                console.log(response);
                this.errorMessage = '';
            }, error => {
                console.error('Error:', error);
                this.errorMessage = 'Choose another location!';
            }
            );
    }
}
