import { GraphQLClient, gql } from 'graphql-request'
import { getAccessToken } from '../auth'

const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const accessToken = getAccessToken()
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` }
    }
    return {}
  },
})

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `
  const { job } = await client.request(mutation, {
    input: { title, description },
  })
  return job
}

export async function updateJob({ title, description }) {
  const mutation = gql`
    mutation UpdateJob($input: UpdateJobInput!) {
      job: updateJob(input: $input) {
        id
      }
    }
  `
  const { job } = await client.request(mutation, {
    input: { title, description },
  })
  return job
}

export async function getCompany(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `
  // const { company } = await client.request(query, { id })
  // return company
  const { data } = await apolloClient.query({
    query,
    variables: { id },
  })
  return data.company
}

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        company {
          id
          name
        }
        description
      }
    }
  `
  // const { job } = await client.request(query, { id })
  // return job
  const { data } = await apolloClient.query({
    query,
    variables: { id },
  })
  return data.job
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `
  // const { jobs } = await client.request(query)
  // return jobs
  const { data } = await apolloClient.query({ query })
  return data.jobs
}
