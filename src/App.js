import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
  API_KEY as apiKey,
  CLIENT_ID as clientId,
  DISCOVERY_DOCS as discoveryDocs,
  SCOPES as scope,
} from './requests';


const now = new Date();
let calApiLoaded;
let firstDay = new Date(now.getFullYear(), now.getMonth() - 1, -7);
let lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 14);



class App extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            events: []
        };
        console.log(this.state.events)
    }
    
    componentDidMount() {
       window.onGoogleLoad = () => {
           window.gapi.load('client', this.initClient);
       }
      // this.loadGoogleSDK();
   }
    // Load the SDK asynchronously
    /* loadGoogleSDK = () => {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                onGoogleLoad();
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://apis.google.com/js/api.js?onload=onGoogleLoad";
            js.onload = "onGoogleLoad";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
    };

   */

    initClient = () => {
        window.gapi.client.init({
            apiKey,
            clientId,
            discoveryDocs,
            scope
        }).then(() => {
            calApiLoaded = true;
            this.getEvents(firstDay, lastDay);
        });
    }


    getEvents = (firstDay, lastDay) => {
        if (calApiLoaded) {
            window.gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': firstDay.toISOString(),
                'timeMax': lastDay.toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 100,
                'orderBy': 'startTime'
            }).then((response) => {
                let event;
                const events = response.result.items;
                console.log('EVENTS: ',events)
                const eventList = [];
                for (var i = 0; i < events.length; ++i) {
                    event = events[i];
                    eventList.push({
                        start: new Date(event.start.date || event.start.dateTime),
                        end: new Date(event.end.date || event.end.dateTime),
                        text: event.summary || 'No Title'
                    });
                }
                this.setState({ events: eventList });

                console.log(response)
            });
        }
    }
    
    
    render() {
    return (
            <FullCalendar
              plugins={[ dayGridPlugin ]}
              initialView="dayGridMonth"
              weekends={true}
              initialEvents={this.state.events} 
            />  
    )
    }
}

export default App;
