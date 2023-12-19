import { faker } from "@faker-js/faker";

export type User = {
  userId: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  canSort: string;
  isSortable: boolean;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): User => {
  return {
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.shuffle<User["role"]>(["Admin", "User"])[0]!,
    status: faker.helpers.shuffle<User["status"]>(["Active", "Inactive"])[0]!,
    isSortable: false,
    canSort: "",
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): User[] => {
    const len = lens[depth]!;
    return range(len).map((d): User => {
      return newPerson();
    });
  };

  return makeDataLevel();
}
