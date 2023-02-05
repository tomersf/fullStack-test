import express from "express";
import {
  getAllPersons,
  addPerson,
  getPerson,
  deletePerson,
} from "../controllers";

const router = express.Router();

router.route("/").get(getAllPersons).post(addPerson);
router.route("/:id").get(getPerson).delete(deletePerson);

export default router;
