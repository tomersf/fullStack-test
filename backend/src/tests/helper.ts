import { Person } from "../interfaces";
import ModelPerson from "../models/Person";

enum API_ROUTES {
    PERSONS = '/api/persons/'
}

const initialPersons: Omit<Person,'id'>[] = [
    {
       name: 'Tomer',
       number: '000-01234567'
    },
    {
        name: 'Test',
        number: '001-0123456789'
    }
 ]

 const personsInDB = async () => {
    const persons = await ModelPerson.find({})
    return persons.map(person => person.toJSON())
 }

 const nonExistingId = async () => {
    const person = new ModelPerson({name:'Simple Test', number:'000-0000000' })
    await person.save()
    await person.remove()
    return person._id.toString()
  }

export default {initialPersons, API_ROUTES, personsInDB, nonExistingId}