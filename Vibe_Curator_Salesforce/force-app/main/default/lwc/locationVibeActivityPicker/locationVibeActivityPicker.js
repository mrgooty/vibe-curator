import { LightningElement, track } from 'lwc';

export default class LocationVibeActivityPicker extends LightningElement {
    @track location = '';
    @track timeFrame = '';
    @track selectedActivity = '';
    @track activityOptions = [
        { label: 'Hiking', value: 'Hiking' },
        { label: 'City Art Exploration', value: 'City Art Exploration' },
        { label: 'Thrift Stores', value: 'Thrift Stores' },
        // Add additional options as needed
    ];
    
    @track showVibeOverlay = false;
    @track vibeWords = [];
    @track currentVibeWord = '';
    @track vibeSummary = '';

    handleLocationChange(event) {
        this.location = event.target.value;
    }

    handleTimeFrameChange(event) {
        this.timeFrame = event.target.value;
    }
    
    handleActivityChange(event) {
        this.selectedActivity = event.detail.value;
    }
    
    openVibePicker() {
        this.showVibeOverlay = true;
    }
    
    handleVibeWordChange(event) {
        this.currentVibeWord = event.target.value;
    }
    
    addVibeWord() {
        if (this.currentVibeWord && this.vibeWords.length < 5) {
            this.vibeWords.push(this.currentVibeWord);
            this.currentVibeWord = '';
        }
    }
    
    closeVibePicker() {
        this.showVibeOverlay = false;
        // Create a summary string from the vibe words
        this.vibeSummary = this.vibeWords.join(', ');
    }
    
    handleNext() {
        // Continue to the final screen.
        // Typically, you would pass the collected data (location, timeFrame,
        // vibe words, and selected activity) to an Apex method or navigate
        // to the final screen component.
    }
}
