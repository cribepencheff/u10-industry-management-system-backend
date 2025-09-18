export const resolvers = {
  Query: {
    works: async (_p, args) => {},
    work: async (_p, { id }) => {},
  },
  Work: {
    composer: async (doc) => {},
  },
};
