import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import * as React from 'react';
import IActivity from './IActivity';

const style = {
  width: '97%',
  height: '500px'
}

interface mapProps{
  activities: IActivity[];
  callBack: (id) => {};
}



export class MapContainer extends React.Component<mapProps, null> {
  

render() {

  const marks = [];
  let centerLat = 47.5;
  let centerLng = 19.06;

if(this.props.activities !=  null){
    this.props.activities.forEach((activity) => {
      if(activity.positions != null){
        marks.push(
          <Marker
          onClick = {() => this.props.callBack(activity.drivers.id)}
          key = {activity.drivers.id}
          title={activity.drivers.lastName + ' ' + activity.drivers.firstName}
          name={activity.drivers.lastName + ' ' + activity.drivers.firstName}
          position={{lat: activity.positions.lat, lng: activity.positions.lng}} />
        );
      }
    })
  }
  
    return (
      <Map google={(this.props as any).google}
      onClick = {() => this.props.callBack(null)} 
      clickableIcons={false}
      style={style}
          initialCenter={{
            lat: centerLat,
            lng: centerLng
          }}
          zoom={14}>

          { marks }
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBqUq_H4K0ryQIA3PvyLMDkYgrABzlZaDM",
  version: '3.28'
})(MapContainer)
