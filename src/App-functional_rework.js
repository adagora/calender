/* global gapi */
import React , { useState } from 'react';
import moment from 'moment';
import Button from './Button';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
  API_KEY as apiKey,
  CLIENT_ID as clientId,
  DISCOVERY_DOCS as discoveryDocs,
  SCOPES as scope,
} from './requests';



export default function App(props) {
  const [events, setEvents] = useState([])
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    gapi
    .load('client:auth2', () => {
      gapi
      .client
      .init({
        apiKey,
        clientId, 
        discoveryDocs, 
        scope})
      .then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }, []);

  const transformEventsToBigCalendar = (items) => {
    return items.map(
      ({id, summary: title, start: originalStart, end: originalEnd}) => {
        let allDay;
        let start;
        let end;

        if (originalStart.date === undefined) {
          allDay = false;
          start = moment(originalStart.dateTime).toDate();
          end = moment(originalEnd.dateTime).toDate();
        } else {
          allDay = true;
          start = moment(originalStart.date).toDate();
          end = moment.utc(originalEnd.date).toDate();
        }

        return {allDay, id, title, start, end};
      }
    );
  }

  const getEvents = async () => {
    try {
      const {result: {items}} = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });
      console.log({result: {items}})

      return transformEventsToBigCalendar(items)
    } catch (e) {
      console.error(e);
    }
  }

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn();
  }

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
  }

  const updateSigninStatus = async (isSignedIn) => {
    if (isSignedIn) {
      const events = await getEvents();

      setEvents();
      setIsSignedIn(true);
      } else {
      setEvents([]);
      setIsSignedIn(false); 
      };
  }
  
    return (
      isSignedIn
      ? <>
          <Button label="Logout" onClick={handleLogout} />
          <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            weekends={true}
            initialEvents={events} 
          />
        </>
      : <Button label="Login" onClick={handleLogin} />
    );
}
