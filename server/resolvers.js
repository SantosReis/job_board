import { getJobs } from './db/jobs.js'

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },

  Job: {
    date: (job) => {
      return job.createdAt.slice(0, 'yyyy-mm-dd'.length)
    },
  },
}
