import { readFileSync } from "fs";
import path from "path";
import { Person } from "../interfaces";

enum MONGODB_ERROR_NAMES {
  'CastError' = 'CastError',
  'ValidationError' = 'ValidationError'
}

const loadDB = (): Person[] => {
  return JSON.parse(
    readFileSync(path.join(__dirname, "db.json"), { encoding: "utf-8" })
  );
};

export { loadDB, MONGODB_ERROR_NAMES};
