import React, { useEffect, useState } from "react";
import axios from "axios";
import { Message, Person } from "./interfaces";
import {
  deletePerson,
  fetchPersons,
  updatePerson,
  updatePersons,
} from "./services/person";

const App = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState<Message>();

  const handleAddName = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!number) return;
    if (
      persons.find(
        (person) => person.name === newName && person.number !== number
      )
    ) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((p) => p.name === newName);
        if (!person) return;
        updatePerson(person.id, number)?.then((r) => {
          let newPerson = {
            name: newName,
            number,
            id: persons[persons.length - 1].id + 1,
          };
          setPersons(persons.map((p) => (p.id !== person.id ? p : newPerson)));
        });
      }
      return;
    }
    if (
      persons.find(
        (person) => person.name === newName && person.number === number
      )
    )
      return;
    const newPerson = {
      name: newName,
      number,
      id: persons[persons.length - 1].id + 1,
    };
    setPersons(persons.concat(newPerson));
    updatePersons(newPerson);
    setShowMessage(true);
    setMessage({ class: "success", msg: `Added ${newPerson.name}` });
    setTimeout(() => setShowMessage(false), 1000);
  };

  useEffect(() => {
    fetchPersons().then((response) => setPersons(response.data));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      {showMessage ? <div className={message?.class}>{message?.msg}</div> : ""}
      <div>
        filter shown with{" "}
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilter(e.target.value.toLowerCase())
          }
        />
      </div>
      <form>
        <div>
          name:{" "}
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewName(e.target.value)
            }
          />
          <div>
            number:{" "}
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNumber(e.target.value)
              }
            />
          </div>
        </div>
        <div>
          <button type="submit" onClick={handleAddName}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons
          .filter((p) => p.name.toLowerCase().includes(filter))
          .map((person) => (
            <li key={person.id}>
              {person.name} {person.number}{" "}
              <button
                onClick={() =>
                  deletePerson(person.id)
                    .then((r) =>
                      setPersons(persons.filter((p) => p.id !== person.id))
                    )
                    .catch((err) => {
                      setShowMessage(true);
                      setMessage({
                        class: "error",
                        msg: `Information of ${person.name} has already been remoed from server`,
                      });
                      setTimeout(() => setShowMessage(false), 1000);
                    })
                }
              >
                delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default App;
