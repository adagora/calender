import React from 'react';


class UserCalendar extends React.Component {
    getUsersCalendarList = async (accessToken) => {
        let calendarsList = await fetch('https://www.googleapis.com/calenda/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${accessToken}`},
        });
        return calendarsList.json();
        
    }


  render() {
    
    return (
        <div>

        </div>
    );
 
  }
}

export default UserCalendar;
