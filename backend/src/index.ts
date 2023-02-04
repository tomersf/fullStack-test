import express from "express";
import morgan from "morgan";
import { readFile, readFileSync } from "fs";
import path from "path";

type Person = {
  id: number;
  name: string;
  number: string;
};
const app = express();

let phonebook: Person[] = JSON.parse(
  readFileSync(path.join(__dirname, "db.json"), { encoding: "utf-8" })
);

app.use(express.json());
app.use(express.static("build"));

morgan.token("body", (req: any) => {
  if (Object.keys(req.body).length == 0) return "";
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :body - :response-time ms"));

app.get("/api/persons", (req, res) => {
  res.status(200).send(phonebook);
});

app.post("/api/persons", (req, res) => {
  const person = req.body as Partial<Person>;
  if (!person.name || !person.number)
    return res.status(401).end("Make sure there is name and number");

  if (phonebook.find((personObj) => personObj.name === person.name))
    return res.status(401).json({ error: "name must be unique" });

  person.id = Math.max(...phonebook.map((person) => person.id)) + 1;
  phonebook.push(person as Person);
  res.status(200).send("success");
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((person) => person.id === Number(id));
  if (!person) return res.status(404).end("Unable to find person");

  return res.status(200).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((person) => person.id === Number(id));
  if (!person) return res.status(404).end("Unable to find person");

  phonebook = phonebook.filter((person) => person.id !== Number(id));
  return res.status(204).send("Person was deleted");
});

app.get("/info", (req, res) => {
  const msg = `Phonebook has info for ${phonebook.length} people,
  Current date is: ${new Date().toUTCString()}`;
  res.status(200).send(msg);
});

app.use((req, res) => res.status(404).json({ error: "unknown endpoint" }));

app.listen(process.env.PORT || 3001, () => {
  console.log("listening on port 3001...");
});
