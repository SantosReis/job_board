import { getCompany } from './db/companies.js'
import { getJob, getJobs } from './db/jobs.js'

export const resolvers = {
  Query: {
    job: (_root, { id }) => {
      console.log('[Query.job] id:', id).getJob(id)
      return null
    },
    jobs: () => getJobs(),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length)
}
