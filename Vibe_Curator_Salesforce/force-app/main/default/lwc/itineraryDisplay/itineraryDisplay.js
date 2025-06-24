import { LightningElement, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET_LIB from '@salesforce/resourceUrl/leaflet_lib';

export default class ItineraryDisplay extends LightningElement {
    @api destination;
    @api duration;
    @api highlights = [];
    @api playlist;
    mapInitialized = false;
    map;

    renderedCallback() {
        if (this.mapInitialized) {
            return;
        }
        this.mapInitialized = true;

        Promise.all([
            loadScript(this, LEAFLET_LIB + '/leaflet.min.js'),
            loadStyle(this, LEAFLET_LIB + '/leaflet.css')
        ])
        .then(() => {
            const L = window.L;
            const mapContainer = this.template.querySelector('.mapContainer');
            this.map = L.map(mapContainer).setView([51.505, -0.09], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(this.map);
            this.addRouteMarkers();
        })
        .catch(error => {
            console.error('Error loading Leaflet:', error);
        });
    }

    addRouteMarkers() {
        if (this.map) {
            const destinations = [
                { lat: 51.505, lng: -0.09 },
                // Other coordinates as provided by your recommendation engine.
            ];
            destinations.forEach(dest => {
                const L = window.L;
                L.marker([dest.lat, dest.lng]).addTo(this.map);
            });
        }
    }

    handleRestart() {
        // Code to restart or navigate back.
    }
}
