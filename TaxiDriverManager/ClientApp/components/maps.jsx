import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import * as React from 'react';

const style = {
  width: '95%',
  height: '500px'
}

export class MapContainer extends React.Component {
render() {
    return (
      <Map google={this.props.google} 
      style={style}
          initialCenter={{
            lat: 47.49801,
            lng: 19.03991
          }}
          zoom={10}>
        <Marker
        title={'The marker`s title will appear as a tooltip.'}
        name={'SOMA'}
        position={{lat: 37.778519, lng: -122.405640}} />

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBqUq_H4K0ryQIA3PvyLMDkYgrABzlZaDM"
})(MapContainer)
