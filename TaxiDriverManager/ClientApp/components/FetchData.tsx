import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

interface DriversState {
    drivers: Drivers[];
    loading: boolean;
}

export class FetchData extends React.Component<RouteComponentProps<{}>, DriversState> {
    constructor() {
        super();
        this.state = { drivers: [], loading: true };

        fetch('api/Drivers')
            .then(response => response.json() as Promise<Drivers[]>)
            .then(data => {
                this.setState({ drivers: data, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.renderForecastsTable(this.state.drivers);

        return <div>
            <h1>Drivers</h1>
            <p>This component demonstrates fetching data from the server.</p>
            { contents }
        </div>;
    }

    private static renderForecastsTable(drivers: Drivers[]) {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Last name</th>
                    <th>First name</th>
                    <th>Date of birth</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {drivers.map(drivers =>
                    <tr key={drivers.id }>
                        <td>{drivers.lastName }</td>
                        <td>{drivers.firstName }</td>
                        <td>{drivers.dateOfBirth }</td>
                        <td>{drivers.currentStatus }</td>
                </tr>
            )}
            </tbody>
        </table>;
    }
}

interface Drivers {
        id: number, 
        lastName: string,
        firstName: string,
        dateOfBirth: string,
        currentStatus: string

}
