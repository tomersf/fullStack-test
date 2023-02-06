import { Schema, model, connect } from "mongoose";
import { Person } from "../interfaces";

const personSchema = new Schema<Person>({
  name: { type: String, required: [true, 'Name must be at least 3 chars long'], minlength: 3 },
  number: {
    type: String,
    validate: {
      validator: (value: string) => {
        return /\d{2,3}-\d{6,}/.test(value);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Must enter a phone number'],
    minlength: 8
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default model<Person>("Person", personSchema);
