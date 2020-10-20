import axios from 'axios';
import {
  API_KEY,
  CLIENT_ID,
} from './requests';

const GOOGLE_CALENDAR_URL = `https://www.googleapis.com/calendar/v3/calendars/${CLIENT_ID}/events?key=${API_KEY}`;


export function getEvents(callback) {
  axios.get(GOOGLE_CALENDAR_URL).end((err, resp) => {
    if (!err) {
      const events = [];
      JSON.parse(resp.text).items.map(event => {
        return events.push({
          start: new Date(event.start.dateTime.toString()),
          end: new Date(event.end.dateTime.toString()),
          title: event.summary
        });
      });
      callback(events);
    }
  });
}