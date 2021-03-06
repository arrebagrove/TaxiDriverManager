import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as request from 'superagent';
import IDrivers from './IDrivers';
import IActivity from './IActivity';
import GoogleApiWrapper from './maps';
import {MapContainer} from './maps';
import * as signalR from '@aspnet/signalr-client';

interface ActivityState {
    activities: IActivity[];
    loading: boolean;
    clickedDriverId: number;
    hubConnection: any;
}

const style = {
    color: '#fff',
    background: '#FFD27F',
    transition: '0.5s' 
}

export class Activity extends React.Component<RouteComponentProps<{}>, ActivityState> {
    constructor() {
        super();
        this.state = {hubConnection: new signalR.HubConnection('/chat'), clickedDriverId: null, activities: [], loading: true };
        this.mapCallBack = this.mapCallBack.bind(this);
        this.getActivities();
    }

    componentDidMount(){
        this.startHubConnection();
    }

    public render() {
        let contents = this.state.loading
        ? <p><em>Loading Table...</em></p>
        : this.renderActivities(this.state.activities);

        let googleMap = this.state.loading
        ? <p><em>Loading Map...</em></p>
        : this.renderMap(this.state.activities);

        return <div>
            <div style= {{"marginTop": "525px"}}>
            { contents }
            </div>
            <div style= {{"marginTop": "-800px"}}>
            { googleMap }
            </div>;
            </div>;
    }

    mapCallBack(id){
        this.setState({clickedDriverId: id});
    }

    startHubConnection(){

        this.state.hubConnection.on('send', data => {
            console.log(data);           
            this.getActivities();
            document.getElementById(data).classList.add("highlight");
            setInterval(() =>{
                document.getElementById(data).classList.remove("highlight");                
            },2500);
        });

        this.state.hubConnection.start();        
    }

    private renderMap(activities: IActivity[]) {
        return <GoogleApiWrapper 
        activities = { this.state.activities }   
        callBack= { this.mapCallBack }
        />

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
                    <tr id={activities.drivers.id.toString()} key={ activities.drivers.id } style={activities.drivers.id == this.state.clickedDriverId? style: {}}>
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
