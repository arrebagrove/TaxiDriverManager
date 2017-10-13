import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as request from 'superagent';
import IDrivers from './IDrivers';
import IActivity from './IActivity'
import GoogleApiWrapper from './maps.jsx'
import {MapContainer} from './maps.jsx'

interface ActivityState {
    activities: IActivity[];
    loading: boolean;
}


export class Activity extends React.Component<RouteComponentProps<{}>, ActivityState> {
    constructor() {
        super();
        this.state = { activities: [], loading: true };

        this.getActivities();
    }

    public render() {
        let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : this.renderActivities(this.state.activities);

        return <div>
            <GoogleApiWrapper/><div>hello</div>
            <div style= {{"marginTop": "500px"}}>
            { contents }
            </div>
            </div>;
    }

    private renderActivities(activities: IActivity[]) {
        let car = activities ? 'van':'nincs';
        let tdstyle = {visibility: 'hidden'};                              
        
        return <table className='table'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Area</th>
                    <th>Time Stamp</th>
                    <th>Car Seats</th>

                </tr>
            </thead>
            <tbody>
                {activities.map(activities =>
                    <tr key={ activities.drivers.id }>
                        <td>{`${activities.drivers.lastName} ${activities.drivers.firstName}`}</td>
                        <td>{activities.drivers.currentStatus }</td>
                        <td>{activities.positions? activities.positions.area: "" }</td>
                        <td>{activities.positions? activities.positions.timeStamp: "" }</td>
                        <td>{activities.drivers.car? activities.drivers.car.seats: ""}</td>
                </tr>
            )}
            </tbody>
        </table>;
    } 

    getActivities(){
        request
        .get('api/Drivers/ActiveDrivers')
        .end( (err, res) => {
            if (err || !res.ok) {
              alert('Error');
            } else {
              this.setState({ activities: res.body as IActivity[], loading: false })
            }
          });
    }
}
