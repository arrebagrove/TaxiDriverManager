import * as React from 'react';
import { RouteComponentProps } from 'react-router';
//import 'isomorphic-fetch';
import * as request from 'superagent';
import { Button } from 'react-bootstrap';
import * as ReactModal from 'react-modal';
import IDrivers from './IDrivers';
import ICar from './ICar'
import { Link } from "react-router-dom";


interface DriversState {
    drivers: IDrivers[];
    loading: boolean;
    showDriverModal: boolean;
    showEditDriverModal: boolean;
    selectedDriver: IDrivers;
    showCarModal: boolean;
    showEditCarModal: boolean;
}

const customStyles = {
    overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(0, 0, 0, 0.75)'
      },
      content : {
        position                   : 'absolute',
        top                        : '25%',
        left                       : '40%',
        right                      : 'auto',
        bottom                     : 'auto',
        border                     : '1px solid #ccc',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '4px',
        outline                    : 'none',
        padding                    : '20px',
    
      }
  };


export class Drivers extends React.Component<RouteComponentProps<{}>, DriversState> {

    constructor() {
        super();
        this.state = { drivers: [], loading: true, showDriverModal: false, showEditDriverModal: false, selectedDriver: null, showCarModal: false, showEditCarModal: false };
              
        this.handleOpenDriverModal = this.handleOpenDriverModal.bind(this);
        this.handleCloseDriverModal = this.handleCloseDriverModal.bind(this);
        this.handleOpenEditDriverModal = this.handleOpenEditDriverModal.bind(this);
        this.handleCloseEditDriverModal = this.handleCloseEditDriverModal.bind(this);
        this.handleAfterOpenEditDriverFunc = this.handleAfterOpenEditDriverFunc.bind(this);
        this.postDriver = this.postDriver.bind(this);
        this.putDriver = this.putDriver.bind(this);

        this.handleOpenCarModal = this.handleOpenCarModal.bind(this);
        this.handleCloseCarModal = this.handleCloseCarModal.bind(this);
        this.handleOpenEditCarModal = this.handleOpenEditCarModal.bind(this);
        this.handleCloseEditCarModal = this.handleCloseEditCarModal.bind(this);
        this.handleAfterOpenEditCarFunc = this.handleAfterOpenEditCarFunc.bind(this);
        this.postCar = this.postCar.bind(this);
        this.putCar = this.putCar.bind(this);

        this.getDrviers();
    }

    handleOpenDriverModal () {
        this.setState({ showDriverModal: true });
      }
      
    handleCloseDriverModal () {
        this.setState({ showDriverModal: false });
      }

    handleOpenEditDriverModal (id: number) {
        this.getDrvier(id).then((res)=>{
            let driver = res.body as IDrivers;
            this.setState({ showEditDriverModal: true, selectedDriver: driver });
        });
      }
      
    handleCloseEditDriverModal () {
        this.setState({ showEditDriverModal: false, selectedDriver: null });
      }

    handleAfterOpenEditDriverFunc(){
        (document.getElementById('firstname') as HTMLInputElement).value = this.state.selectedDriver.firstName?this.state.selectedDriver.firstName: "";
        (document.getElementById('lastname') as HTMLInputElement).value = this.state.selectedDriver.lastName? this.state.selectedDriver.lastName: "";
        (document.getElementById('dateofbirth') as HTMLInputElement).value = this.state.selectedDriver.dateOfBirth? this.state.selectedDriver.dateOfBirth.substr(0,10): "";
        (document.getElementById('email') as HTMLInputElement).value = this.state.selectedDriver.email? this.state.selectedDriver.email: "";

    }

    handleOpenCarModal (id: number) {
        this.getDrvier(id).then((res)=>{
            let driver = res.body as IDrivers;
            this.setState({ showCarModal: true, selectedDriver: driver });
        });
      }
      
    handleCloseCarModal () {
        this.setState({ showCarModal: false, selectedDriver: null });
      }

    handleOpenEditCarModal (id: number) {
        this.getDrvier(id).then((res)=>{
            let driver = res.body as IDrivers;
            this.setState({ showEditCarModal: true, selectedDriver: driver });
        });
      }
      
    handleCloseEditCarModal () {
        this.setState({ showEditCarModal: false, selectedDriver: null });
      }

    handleAfterOpenEditCarFunc(){
        (document.getElementById('brand') as HTMLInputElement).value = this.state.selectedDriver.car.brand?this.state.selectedDriver.car.brand: "";
        (document.getElementById('platenumber') as HTMLInputElement).value = this.state.selectedDriver.car.plateNumber? this.state.selectedDriver.car.plateNumber: "";
        (document.getElementById('seats') as HTMLInputElement).value = this.state.selectedDriver.car.seats? this.state.selectedDriver.car.seats.toString(): "";

    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderDrivers(this.state.drivers);

        let drivermodal = this.renderDriverModal();
        let editdrivermodal = this.renderEditDriverModal();
        let carmodal = this.renderCarModal();
        let editcarmodal = this.renderEditCarModal();

        return <div id="parentDiv">
            { contents }
            <Button bsStyle="warning" bsSize="small" onClick={this.handleOpenDriverModal} >Add new driver</Button>
            { drivermodal }
            { editdrivermodal }
            { carmodal }
            { editcarmodal }
            </div>
    }

    private renderDriverModal(){
        return <ReactModal 
                isOpen={this.state.showDriverModal}
                contentLabel="Driver Modal"
                shouldCloseOnOverlayClick={true}
                style={customStyles}
                >
                Last name:<br/>
                <input type="text" id="lastname"  placeholder="Last Name" required/>
                <br/>
                First name:<br/>
                <input type="text" id="firstname" placeholder="First Name"/>
                <br/>
                Date of birth:<br/>
                <input type="date" id="dateofbirth"/>
                <br/>
                E-mail:<br/>
                <input type="text" id="email" placeholder="E-mail"/>
                <br/><br/>
                <Button bsStyle="success" bsSize="small" onClick={this.postDriver}>Submit</Button>
                <Button bsStyle="danger" bsSize="small" onClick={this.handleCloseDriverModal}>Close</Button>
                </ReactModal>

    }

    private renderEditDriverModal(){
            return <ReactModal 
            isOpen={this.state.showEditDriverModal}
            contentLabel="Edit Driver Modal"
            shouldCloseOnOverlayClick={true}
            style={customStyles}
            onAfterOpen={this.handleAfterOpenEditDriverFunc}
            ariaHideApp={true}
            >
            Last name:<br/>
            <input type="text" id="lastname"  placeholder="Last Name"/>
            <br/>
            First name:<br/>
            <input type="text" id="firstname" placeholder="First Name"/>
            <br/>
            Date of birth:<br/>
            <input type="date" id="dateofbirth"/>
            <br/>
            E-mail:<br/>
            <input type="text" id="email" placeholder="E-mail"/>
            <br/><br/>
            <Button bsStyle="success" bsSize="small" onClick={this.putDriver}>Submit</Button>
            <Button bsStyle="danger" bsSize="small" onClick={this.handleCloseEditDriverModal}>Close</Button>
            </ReactModal>
        
    }

    private renderCarModal(){
        return <ReactModal 
                isOpen={this.state.showCarModal}
                contentLabel="Car Modal"
                shouldCloseOnOverlayClick={true}
                style={customStyles}
                >
                Brand:<br/>
                <input type="text" id="brand"  placeholder="Brand"/>
                <br/>
                Plate number:<br/>
                <input type="text" id="platenumber" placeholder="Plate Number"/>
                <br/>
                Seats:<br/>
                <input type="number" id="seats"/>
                <br/><br/>
                <Button bsStyle="success" bsSize="small" onClick={this.postCar}>Submit</Button>
                <Button bsStyle="danger" bsSize="small" onClick={this.handleCloseCarModal}>Close</Button>
                </ReactModal>

    }
    
    private renderEditCarModal(){
        return <ReactModal 
                isOpen={this.state.showEditCarModal}
                contentLabel="Car Modal"
                shouldCloseOnOverlayClick={true}
                style={customStyles}
                onAfterOpen={this.handleAfterOpenEditCarFunc}
                >
                Brand:<br/>
                <input type="text" id="brand"  placeholder="Brand"/>
                <br/>
                Plate number:<br/>
                <input type="text" id="platenumber" placeholder="Plate Number"/>
                <br/>
                Seats:<br/>
                <input type="number" id="seats"/>
                <br/><br/>
                <Button bsStyle="success" bsSize="small" onClick={this.putCar}>Submit</Button>
                <Button bsStyle="danger" bsSize="small" onClick={this.handleCloseEditCarModal}>Close</Button>
                </ReactModal>        
    }

    private postDriver(){
        const firstname = (document.getElementById('firstname') as HTMLInputElement).value;
        const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
        const dateofbirth = (document.getElementById('dateofbirth') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;

        request
        .post('api/Drivers')
        .set('Content-Type','application/json')
        .send(`{"FirstName": "${firstname}", "Lastname": "${lastname}", "CurrentStatus": "Inactive", DateOfBirth: "${dateofbirth}", "Email": "${email}"}`)
        .end( (err, res) => {
            if (err || !res.ok) {
              alert('Error');
            } else {
              //this.handleCloseDriverModal();
              this.handleCloseDriverModal();
              this.getDrviers();
            }
          });
    }

    private putDriver(){
        const firstname = (document.getElementById('firstname') as HTMLInputElement).value;
        const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
        const dateofbirth = (document.getElementById('dateofbirth') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        
        const id = this.state.selectedDriver.id;
        request
        .put(`api/Drivers/${id}`)
        .set('Content-Type','application/json')
        .send(`{"FirstName": "${firstname}", "Lastname": "${lastname}", DateOfBirth: "${dateofbirth}", "Email": "${email}"}`)
        .end( (err, res) => {
            if (err || !res.ok) {
              alert('Error');
            } else {
              //this.handleCloseDriverModal();
              this.handleCloseEditDriverModal();
              this.getDrviers();
            }
          });
    }

    private getDrviers(){
        request
        .get('api/Drivers')
        .end( (err, res) => {
            if (err || !res.ok) {
              alert('Error');
            } else {
              this.setState({ drivers: res.body as IDrivers[], loading: false })
            }
          });
    }

    private getDrvier(id: number){
        return request
        .get(`api/Drivers/${id}`)

    }

    private deleteDrviers(id: number){
        request
        .delete(`api/Drivers/${id}`)
        .end( (err, res) => {
            if (err || !res.ok) {
              alert('Error');
            } else {
              this.getDrviers();
            }
          });
    }

    private postCar(){
        const brand = (document.getElementById('brand') as HTMLInputElement).value;
        const platenumber = (document.getElementById('platenumber') as HTMLInputElement).value;
        const seats = (document.getElementById('seats') as HTMLInputElement).value;
        const driverid = this.state.selectedDriver.id;

        request
        .post('api/Cars')
        .set('Content-Type','application/json')
        .send(`{"DriverId": "${driverid}", "Brand": "${brand}", PlateNumber: "${platenumber}", "Seats": "${seats}"}`)
        .end( (err, res) => {
            if (err || !res.ok) {
              alert('Error');
            } else {
              //this.handleCloseDriverModal();
              this.handleCloseCarModal();
              this.getDrviers();
            }
          });
    }

    private putCar(){
        const brand = (document.getElementById('brand') as HTMLInputElement).value;
        const platenumber = (document.getElementById('platenumber') as HTMLInputElement).value;
        const seats = (document.getElementById('seats') as HTMLInputElement).value;
        const driverid = this.state.selectedDriver.id;
        
        
        const id = this.state.selectedDriver.car.id;
        request
        .put(`api/Cars/${id}`)
        .set('Content-Type','application/json')
        .send(`{"DriverId": "${driverid}", "Brand": "${brand}", PlateNumber: "${platenumber}", "Seats": "${seats}"}`)
        .end( (err, res) => {
            if (err || !res.ok) {
              alert('Error');
            } else {
              this.handleCloseEditCarModal();
              this.getDrviers();
            }
          });
    }

    private renderDrivers(drivers: IDrivers[]) {
        let car = drivers ? 'van':'nincs';
        let tdstyle = {visibility: 'hidden'};                              
        
        return <table className='table'>
            <thead>
                <tr>
                    <th>Last name</th>
                    <th>First name</th>
                    <th>Date of birth</th>
                    <th>Status</th>
                    <th>E-mail</th>
                    <th>Car</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {drivers.map(drivers =>
                    <tr key={drivers.id }>
                        <td>{drivers.lastName }</td>
                        <td>{drivers.firstName }</td>
                        <td>{drivers.dateOfBirth }</td>
                        <td>{drivers.currentStatus }</td>
                        <td>{drivers.email }</td>
                        <td>{drivers.car
                            ? <Button onClick={() => this.handleOpenEditCarModal(drivers.id)} bsStyle = "info" bsSize="xs"><span className="glyphicon glyphicon-pencil"></span></Button>
                            : <Button onClick={() => this.handleOpenCarModal(drivers.id)} bsStyle = "success" bsSize="xs"><span className="glyphicon glyphicon-plus"></span></Button>
                            }
                        </td>
                        <td id="edit">
                            <Button onClick={() => this.handleOpenEditDriverModal(drivers.id)} bsStyle = "info" bsSize="xs"><span className="glyphicon glyphicon-pencil"></span></Button>
                            <Button onClick={() => this.deleteDrviers(drivers.id)} bsStyle = "danger" bsSize="xs"><span className="glyphicon glyphicon-trash"></span></Button>
                            <Button bsStyle = "success" bsSize="xs"><a href = {`/Account/Register/${drivers.email}`}><span className="glyphicon glyphicon-plus"></span></a></Button>
                        </td>
                </tr>
            )}
            </tbody>
        </table>;
    }

    Register(){
        alert("helo");
        Response.redirect("/Account/Register");
    }

}