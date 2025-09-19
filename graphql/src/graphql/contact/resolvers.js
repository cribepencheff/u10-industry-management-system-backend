import { ContactModel } from "../../models/Contact.js";

export const resolvers = {
  Query: {
    contacts: async (_parent, args) => {
      try {
        const contacts = await ContactModel.find();
        return contacts;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
    contact: async (_parent, { id }) => {
      try {
        const contact = await ContactModel.find(id);
        return contact;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
  },
  Mutation: {
    addContact: async (_parent, { input }) => {
      return ContactModel.create(input);
    },
  },
};
