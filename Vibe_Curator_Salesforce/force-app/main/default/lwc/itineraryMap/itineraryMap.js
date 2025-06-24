import { LightningElement, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import leafletJS from '@salesforce/resourceUrl/leaflet_js';
import leafletCSS from '@salesforce/resourceUrl/leaflet_css';

export default class ItineraryMap extends LightningElement {
    leafletInitialized = false;
    @api markers = []; // Array [{lat: xx, lng: yy}, ...]

    renderedCallback() {
        if (this.leafletInitialized) {
            return;
        }
        this.leafletInitialized = true;

        Promise.all([
            loadScript(this, leafletJS),
            loadStyle(this, leafletCSS)
        ])
        .then(() => {
            // Initialize the map
            const mapContainer = this.template.querySelector('.mapContainer');
            this.map = L.map(mapContainer).setView([51.505, -0.09], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(this.map);

            // Add markers if provided by the parent component
            this.addMarkers();
        })
        .catch(error => {
            console.error('Error loading Leaflet:', error);
        });
    }

    addMarkers() {
        if (this.map && Array.isArray(this.markers)) {
            this.markers.forEach(marker => {
                L.marker([marker.lat, marker.lng]).addTo(this.map);
            });
        }
    }
}
