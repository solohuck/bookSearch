import { gql } from '@apollo/client';

// Define the GET_ME query using the gql tag
export const GET_ME = gql`
  query me {
    me {
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
