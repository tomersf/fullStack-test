import { loadDB } from "../helpers";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Person } from "../interfaces";
import { BadRequestError, NotFoundError } from "../errors";
import ModelPerson from '../models/Person'

const getAllPersons = async (req: Request, res: Response) => {
  const persons = await ModelPerson.find({})
  return res.status(StatusCodes.OK).send(persons);
};

const addPerson = async (req: Request, res: Response) => {
  const person = req.body as Person;
  if (!person.name || !person.number)
    throw new BadRequestError("Please provide name and email");

  const existingPerson = await ModelPerson.findOne({name: person.name, number: person.number})

  if(existingPerson) throw new BadRequestError('Person already exists')
  const newPerson = await ModelPerson.create(person)
  res.status(StatusCodes.CREATED).json(newPerson);
};

const getPerson = async (req: Request, res: Response) => {
  const id = req.params.id;
  const person = await ModelPerson.findOne({_id: id})
  if (!person) throw new NotFoundError("Unable to find person");

  return res.status(StatusCodes.OK).json(person);
};

const deletePerson = async (req: Request, res: Response) => {
  const id = req.params.id;
  const person = await ModelPerson.findByIdAndRemove({_id: id})
  if (!person) throw new NotFoundError("Unable to find person");
  return res.status(StatusCodes.NO_CONTENT).send();
};

export { getAllPersons, getPerson, deletePerson, addPerson };
