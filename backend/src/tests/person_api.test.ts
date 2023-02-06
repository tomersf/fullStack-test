import mongoose from "mongoose";
import supertest from 'supertest'
import ModelPerson from "../models/Person";
import app from "..";
import { StatusCodes } from "http-status-codes";
import helper from "./helper";
import { Person } from "../interfaces";

const api = supertest(app)

beforeEach(async () => {
   await ModelPerson.deleteMany({})
   await ModelPerson.insertMany(helper.initialPersons)
})

describe('when there is initially some persons saved', () => {
  test('persons are returned as json', async () => {
    await api.get(helper.API_ROUTES.PERSONS).expect(StatusCodes.OK).expect('Content-Type', /application\/json/)
 })

  test('all persons are returned', async () => {
    const response = await api.get(helper.API_ROUTES.PERSONS)

    expect(response.body).toHaveLength(helper.initialPersons.length)
  })
})

describe('viewing a specific person', () => {
  test('succeeds with a valid id', async () => {
    const personsAtStart = await helper.personsInDB()

    const personToView = personsAtStart[0]
    const personResult = await api.get(`${helper.API_ROUTES.PERSONS}${personToView.id}`)
      .expect(StatusCodes.OK)
      .expect('Content-Type', /application\/json/)

    expect(personResult.body).toEqual(personToView)
  })

  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api
      .get(`${helper.API_ROUTES.PERSONS}${validNonexistingId}`)
      .expect(StatusCodes.NOT_FOUND)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`${helper.API_ROUTES.PERSONS}${invalidId}`)
      .expect(StatusCodes.BAD_REQUEST)
  })
})

describe('addition of a new person', () => {
  test('succeeds with valid data', async () => {
    const newPerson : Omit<Person,'id'> = {
      name:'Takashi',
      number: '000-15671231'
    } 

    await api
      .post(helper.API_ROUTES.PERSONS)
      .send(newPerson)
      .expect(StatusCodes.CREATED)
      .expect('Content-Type', /application\/json/)

    const personsAfterAdding = await helper.personsInDB()
    expect(personsAfterAdding).toHaveLength(helper.initialPersons.length + 1)

    const contents = personsAfterAdding.map(person => person.name)
    expect(contents).toContain(
      'Takashi'
    )
  })

  test('fails with status code 400 if data invalid', async () => {
    const newPerson = {
      name: 'Ts'
    }

    await api
      .post(helper.API_ROUTES.PERSONS)
      .send(newPerson)
      .expect(StatusCodes.BAD_REQUEST)

    const personsAtEnd = await helper.personsInDB()
    expect(personsAtEnd).toHaveLength(helper.initialPersons.length)
  })
})

describe('deletion of a person', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const personsAtStart = await helper.personsInDB()
    const personToDelete = personsAtStart[0]

    await api
      .delete(`${helper.API_ROUTES.PERSONS}${personToDelete.id}`)
      .expect(StatusCodes.NO_CONTENT)

    const personsAtEnd = await helper.personsInDB()

    expect(personsAtEnd).toHaveLength(
      helper.initialPersons.length - 1
    )

    const contents = personsAtEnd.map(person => person.name)
    expect(contents).not.toContain(personToDelete.name)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})