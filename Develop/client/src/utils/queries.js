import { gql } from '@apollo/client';

// Define the GET_ME query using the gql tag
export const GET_ME = gql`
  query {
    
    me {
      _id
      username
      email

      books {
        bookId
        authors
        authors
        description
        title
        image
        link
      }
    }
  }
`;
