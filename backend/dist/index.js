"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
let phonebook = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, "db.json"), { encoding: "utf-8" }));
app.use(express_1.default.json());
app.use(express_1.default.static("build"));
morgan_1.default.token("body", (req) => {
    if (Object.keys(req.body).length == 0)
        return "";
    return JSON.stringify(req.body);
});
app.use((0, morgan_1.default)(":method :url :status :body - :response-time ms"));
app.get("/api/persons", (req, res) => {
    res.status(200).send(phonebook);
});
app.post("/api/persons", (req, res) => {
    const person = req.body;
    if (!person.name || !person.number)
        return res.status(401).end("Make sure there is name and number");
    if (phonebook.find((personObj) => personObj.name === person.name))
        return res.status(401).json({ error: "name must be unique" });
    person.id = Math.max(...phonebook.map((person) => person.id)) + 1;
    phonebook.push(person);
    res.status(200).send("success");
});
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = phonebook.find((person) => person.id === Number(id));
    if (!person)
        return res.status(404).end("Unable to find person");
    return res.status(200).json(person);
});
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = phonebook.find((person) => person.id === Number(id));
    if (!person)
        return res.status(404).end("Unable to find person");
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
