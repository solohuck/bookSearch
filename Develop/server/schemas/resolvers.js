const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
       
        const correctPw = await user.isCorrectPassword(password);
    
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }

        const token = signToken(user);
        return { token, user };
    },
    // `addUser` resolver adds a new user.
    addUser: async (parent, { username, email, password }) => {
      // Create a new user.
      const user = await User.create({ username, email, password });
      // Sign a token for the user.
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, BookInput, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: BookInput },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("Must be logged in to save books");
    },
    removeBook: async (parent, bookId, context) => {
      if (context.user) {
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: bookId } },
          { new: true }
        );
      }
      throw new AuthenticationError("Must be logged in to save books");
    },
  },
};

module.exports = resolvers;