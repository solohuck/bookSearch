import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token

      user {
        _id
        email
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!) {
    addUser(username: $username, email: $email) {
      token

      user {
        _id
        email
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook(
    $bookId: String!
    $authors: [String!]!
    $description: String!
    $title: String!
    $image: String!
    $link: String!
  ) {
    saveBook(
      bookId: $bookId
      authors: $authors
      description: $description
      title: $title
      image: $image
      link: $link
    ) {
      _id
      email
      username
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

export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      email
      username
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

