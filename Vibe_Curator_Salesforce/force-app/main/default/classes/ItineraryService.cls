public with sharing class ItineraryService {
    /**
     * Processes a user preference record by calling an external recommendation engine.
     * Use @future to handle asynchronous processing and callouts.
     */
    @future(callout=true)
    public static void processUserPreferences(Id userPreferenceId) {
        // Retrieve the user preference record – add all the necessary fields as needed.
        User_Preferences__c pref = [SELECT Id, Field1__c, Field2__c FROM User_Preferences__c WHERE Id = :userPreferenceId LIMIT 1];
        
        // Construct JSON payload for the external API.
        String payload = JSON.serialize(new Map<String, Object>{
            'id' => pref.Id,
            'field1' => pref.Field1__c,
            'field2' => pref.Field2__c
        });
        
        // Prepare HTTP request – replace with your actual endpoint.
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://your-python-service-domain.com/api/recommendations');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(payload);
        
        Http http = new Http();
        try {
            HttpResponse res = http.send(req);
            if(res.getStatusCode() == 200) {
                // Process the JSON response and map returned data.
                Map<String, Object> result = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
                Itinerary__c itinerary = new Itinerary__c(
                    User_Preference_Id__c = pref.Id,
                    Recommendation__c = (String)result.get('recommendation')
                );
                insert itinerary;
            } else {
                System.debug('HTTP error: ' + res.getStatusCode() + ' ' + res.getBody());
            }
        } catch(Exception e) {
            System.debug('Callout exception: ' + e.getMessage());
        }
    }
}
