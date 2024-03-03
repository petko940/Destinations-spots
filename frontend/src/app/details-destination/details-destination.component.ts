import { Component, OnInit } from '@angular/core';
import { Destination } from '../types/destination';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';


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

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const destinationId = Number(params['id']);
            this.http.get<Destination>('http://127.0.0.1:8000/api/destination/' + destinationId)
                .subscribe(data => {
                    this.isLoading = false;
                    this.destination = data;
                    console.log(this.destination);
                    
                    setTimeout(() => {
                        this.showMap()
                    })
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

}
