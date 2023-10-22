import { GraphQLError } from 'graphql'
import { getCompany } from './db/companies.js'
import { getJob, getJobs, getJobByCompany } from './db/jobs.js'

export const resolvers = {
  Query: {
    //company: (_root, { id }) => getCompany(id),
    company: async (_root, { id }) => {
      const company = await getCompany(id)
      if (!company) {
        throw new GraphQLError('No Company found with id' + id, {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      return company
    },
    job: (_root, { id }) => getJob(id),
    jobs: () => getJobs(),
  },

  Company: {
    jobs: (company) => getJobByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length)
}
