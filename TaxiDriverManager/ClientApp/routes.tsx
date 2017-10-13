import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Drivers } from './components/Drivers';
import { Activity } from './components/Activity';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/Activity' component={ Activity } />
    <Route path='/Drivers' component={ Drivers } />
</Layout>;
