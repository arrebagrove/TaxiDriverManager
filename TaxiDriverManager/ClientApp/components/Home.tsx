import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className="homepage">
            <h1>Dear User</h1>
            <p>This web site was created for managing taxi drivers.</p>
            <p>Under the Activity page you can see where our drivers are.</p>
            <p>Under the Drivers page you can create/modify drivers</p>
        </div>;
    }
}
