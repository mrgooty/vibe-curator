import { LightningElement, track } from 'lwc';
// Import apex method for record creation if needed
export default class UserPreferences extends LightningElement {
    @track hobbies = '';
    @track likes = '';
    @track dislikes = '';

    handleChange(event) {
        const field = event.target.label;
        if (field === 'Hobbies') {
            this.hobbies = event.target.value;
        } else if (field === 'Likes') {
            this.likes = event.target.value;
        } else if (field === 'Dislikes') {
            this.dislikes = event.target.value;
        }
    }

    handleNext() {
        // You might call an Apex method to create a User_Preferences__c record
        // and then navigate to the second screen.
        // Example:
        // createUserPreference({ hobbies: this.hobbies, likes: this.likes, dislikes: this.dislikes })
        //   .then(() => { navigateTo('locationPicker'); });
    }
}
