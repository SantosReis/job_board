export const resolvers = {
  Query: {
    jobs: () => {
      return [
        {
          id: 'test-id 2',
          title: 'The Title 2',
          description: null,
        },
      ]
    },
  },
}
