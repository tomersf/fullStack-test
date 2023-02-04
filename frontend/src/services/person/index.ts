import axios from "axios";
import { Person } from "../../interfaces";

const deletePerson = (id: number) => {
  return axios.delete(`http://localhost:3001/persons/${id}`);

  // .then((r) => setPersons(persons.filter((p) => p.id !== id)));
};

const fetchPersons = () => {
  return axios.get("http://localhost:3001/persons");

  //   .then((response) => {
  //     setPersons(response.data);
  //   });
};

const updatePerson = (id: number, phone: string) => {
  return axios.patch(`http://localhost:3001/persons/${id}`, {
    number: phone,
  });
};

const updatePersons = (person: Person) => {
  axios.post("http://localhost:3001/persons", person);
};

export { deletePerson, fetchPersons, updatePerson, updatePersons };
