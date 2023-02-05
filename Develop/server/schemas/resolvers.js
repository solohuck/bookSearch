const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require("./models");
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // `me` resolver fetches the current user information.
    me: async (parent, args, context) => {
      // Check if the user is authenticated.
      if (context.user) {
        // Find the user and populate the saved books.
        return await User.findOne({ _id: context.user._Id }).populate('books')
      }
      // If the user is not authenticated, throw an error.
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    // `login` resolver authenticates the user.
    login: async (parent, { email, password }) => {
      try {
        // Find the user with the given email address.
        const user = await User.findOne({ email });
    
        if (!user) {
          throw new Error('No user found with this email address');
        }
        // Check if the given password is correct.
        const correctPw = await user.isCorrectPassword(password);
    
        if (!correctPw) {
          throw new Error('Incorrect credentials');
        }
        // Sign a token for the user.
        const token = signToken(user);
    
        return { token, user };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    // `addUser` resolver adds a new user.
    addUser: async (parent, { username, email }) => {
      // Create a new user.
      const user = await User.create({ username, email });
      // Sign a token for the user.
      const token = signToken(user);
      return { token, user };
    },
    // `saveBook` resolver saves a book for the current user.
    saveBook: async (parent, args, context) => {
      try {
        // Find the current user.
        const user = await User.findOne({ _id: context.userId });
        if (!user) {
          throw new Error("You must be logged in to save a book");
        }
        // Create a new book.
        const book = await Book.create({
          bookId: args.bookId,
          authors: args.authors,
          description: args.description,
          title: args.title,
          image: args.image,
          link: args.link
        });
        // Add the book to the user's saved books.
        user.savedBooks.push(book);
        user.bookCount++;
        // Save the user.
        await user.save();
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    // `removeBook` resolver removes a book from the current user's saved books.
    removeBook: async (parent, args, context) => {
      try {
        // Find the current user.
        const user = await User.findOne({ _id: context.userId });
        // If the user is not found, throw an error indicating that the user must be logged in to remove a book
        if (!user) {
          throw new Error("You must be logged in to remove a book");
        }
        // Find a book based on the `bookId` in the argument
        const book = await Book.findOne({ bookId: args.bookId });
        // If the book is not found, throw an error indicating that no book was found with that id
        if (!book) {
          throw new Error("No book was found with that id");
        }
        // Remove the book from the user's saved books list
        user.savedBooks.pull(book);
        // Decrement the user's book count
        user.bookCount--;
        // Save the user to the database
        await user.save();
        // Return the updated user
        return user;
      } catch (error) {
        // If an error occurs, throw a new error with the error message
        throw new Error(error);
      }
    },
  },
};