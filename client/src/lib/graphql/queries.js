import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from '@apollo/client'
// import { GraphQLClient } from 'graphql-request'
import { getAccessToken } from '../auth'

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//   headers: () => {
//     const accessToken = getAccessToken()
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` }
//     }
//     return {}
//   },
// })

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' })

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  uri: 'http://localhost:9000/graphql',
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'network-only',
  //   },
  //   watchQuery: {
  //     fetchPolicy: 'cache-first',
  //   },
  // },
})

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`

export const companyByIdQuery = gql`
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

const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
  `
  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      })
    },
  })
  return data.job
}

export async function updateJob({ title, description }) {
  const mutation = gql`
    mutation UpdateJob($input: UpdateJobInput!) {
      job: updateJob(input: $input) {
        id
      }
    }
  `
  const { job } = await apolloClient.request(mutation, {
    mutation,
    variables: { input: { title, description } },
  })
  return job
}

export async function getJob(id) {
  // const query = gql`
  //   query JobById($id: ID!) {
  //     job(id: $id) {
  //       id
  //       date
  //       title
  //       company {
  //         id
  //         name
  //       }
  //       description
  //     }
  //   }
  // `
  // const { job } = await client.request(query, { id })
  // return job
  const { data } = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  })
  return data.job
}

export async function getJobs() {
  const query = gql`
    query Jobs {
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
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
  })
  return data.jobs
}
