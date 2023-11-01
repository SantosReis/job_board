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

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`

export const jobsQuery = gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
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

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`

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
