/* global gapi */
import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import request from 'superagent'
import {
  API_KEY as apiKey,
  CLIENT_ID as clientId,
  DISCOVERY_DOCS as discoveryDocs,
  SCOPES as scope,
  GOOGLE_CALENDAR_URL
} from './requests';

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
      }

      initClient = () => {
        window.gapi.client.init({
            apiKey,
            clientId,
            discoveryDocs,
            scope
        }).then(() => {
            this.getEvents();
        });
      }
    
      getEvents () {
        request
          .get(GOOGLE_CALENDAR_URL)
          .end((err, resp) => {
            if (!err) {
              const events = []
              JSON.parse(resp.text).items.map((event) => {
                events.push({
                  start: event.start.date || event.start.dateTime,
                  end: event.end.date || event.end.dateTime,
                  title: event.summary,
                })
              })
              this.setState(events)
            }
          })
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

