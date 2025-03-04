import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// type User {
//   id: number;
//   name: string;
//   email: string;
//   isAdmin: boolean;
// }

const users = [
  {
    id: 1,
    name: "Depp Doe",
    email: "Depp.doe@example.com",
    isAdmin: true,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    isAdmin: false,
  },
];

// apollo server contains the typeDefs and resolvers
// 1. query - get the data [get]
// 2. mutation - update the data [post, put, patch, delete]
// 3. typeRef - define the type of the data [schema]
// 4. resolvers - get the data from the database [controller]

// 3. subscription - get the data in real time [get]
// 4. subscription - update the data in real time [post, put, patch, delete]

/*
   Apollo Server Architecture:
*/

/* 
    1. TypeDefs (Schema) - Define the structure of your data and operations
    - Types represent the objects in your domain
    - Queries define how clients can fetch data
    - Mutations define how clients can modify data
    - Input types for arguments to operations
*/

/* 
    2. Resolvers - Implement the functionality for each field in your schema
    - Query resolvers retrieve data (similar to GET endpoints)
    - Mutation resolvers modify data (similar to POST/PUT/DELETE endpoints)
    - Field resolvers compute derived fields or handle relationships
*/

/* 
    3. Context - Per-request state including auth info and data sources
*/

/*
    4. Data Sources - Optional abstraction for fetching data from databases/APIs
*/

/* 
    type query - how to deal with getting data from the API
    [getUsers, getUser, getPosts, getPost]
*/

/* 
    type mutation - how to deal with updating data from the API
    [createUser, updateUser, deleteUser, createPost, updatePost, deletePost]
*/

/* 
    type subscription - how to deal with getting data in real time from the API
    [subscribeUser, subscribePost]
*/

/*
    resolvers - how to deal with query, mutation, subscription
    [getUsers, getUser, getPosts, getPost, createUser, updateUser, deleteUser, createPost, updatePost, deletePost, subscribeUser, subscribePost]
*/

const typeDefs = `
  # Input types for mutations

  # Queries (Read operations)
  type Query {
    getUsers: [User]
    getUserById(id : ID!): User
  }

  # Mutations (Create, Update, Delete operations)
  type Mutation {
    createUser(name: String!, email: String!, isAdmin: Boolean!): User
    updateUser(id: ID!, name: String, email: String, isAdmin: Boolean): User
    deleteUser(id: ID!): User
  }
    
  # Object types define the resources in your API
  type User {
    id: ID!
    name: String!
    email: String!
    isAdmin: Boolean!
  }
`;

const resolvers = {
  Query: {
    getUsers: () => users,
    getUserById: (parent, args, context, info) => {
      const { id } = args;
      return users.find((user) => user.id === parseInt(id));
    },
  },
  Mutation: {
    createUser: (parent, args, context, info) => {
      const { name, email, isAdmin } = args;
      const newUser = {
        id: users.length + 1,
        name,
        email,
        isAdmin,
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, args, context, info) => {
      const { id, name, email, isAdmin } = args;
      const user = users.find((user) => user.id === parseInt(id));
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      user.name = name || user.name;
      user.email = email || user.email;
      user.isAdmin = isAdmin || user.isAdmin;
      return user;
    },
    deleteUser: (parent, args, context, info) => {
      const { id } = args;
      const userIndex = users.findIndex((user) => user.id === parseInt(id));
      if (userIndex === -1) {
        throw new Error(`User with id ${id} not found`);
      }
      const deletedUser = users.splice(userIndex, 1);
      return deletedUser[0];
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4005 },
});

console.log(`🚀 Server ready at ${url}`);
