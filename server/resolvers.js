import { GraphQLError } from 'graphql'
import { getCompany } from './db/companies.js'
import {
  getJob,
  getJobs,
  getJobByCompany,
  createJob,
  updateJob,
  deleteJob,
} from './db/jobs.js'

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id)
      if (!company) {
        throw notFoundError('No Company found with id' + id)
      }
      return company
    },
    job: async (_root, { id }) => {
      const job = await getJob(id)
      if (!job) {
        throw notFoundError('No Job found with id' + id)
      }
      return job
    },
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { auth }) => {
      // console.log('[createJob] auth: ', auth)
      // return null
      if (!auth) {
        throw unauthorizedError('Missing authentication')
      }

      const companyId = 'FjcJCHJALA4i' //TODO set based on database
      return createJob({ companyId, title, description })
    },
    updateJob: (_root, { input: { id, title, description } }) => {
      return updateJob({ id, title, description })
    },
    deleteJob: (_root, { id }) => deleteJob(id),
  },

  Company: {
    jobs: (company) => getJobByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  })
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  })
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length)
}
