type Person = {
  name: string;
  number: string;
  id: number;
};

type Message = {
  class: "success" | "error";
  msg: string;
};

export type { Person, Message };
