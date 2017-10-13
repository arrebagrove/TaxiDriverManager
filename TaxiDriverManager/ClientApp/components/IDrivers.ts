import ICar from './ICar'

export default interface IDrivers {
    id: number, 
    lastName: string,
    firstName: string,
    dateOfBirth: string,
    currentStatus: string
    email: string
    car: ICar
}