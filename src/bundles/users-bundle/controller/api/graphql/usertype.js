const type = `

  scalar Date
  scalar Url
  scalar Array

  type User {
    username: String!
    surname: String
    name: String
    enabled: Boolean
    userNonExpired: Boolean
    credentialsNonExpired : Boolean
    accountNonLocked: Boolean
    email : String!
    lang : String
    gender: String
    url : Url
    createdAt: Date
    updatedAt: Date
    image: String
    roles : Array
  }

  input UserInput {
    username: String!
    surname: String
    name: String
    enabled: Boolean
    password: String
    confirm: String
    userNonExpired: Boolean
    credentialsNonExpired : Boolean
    accountNonLocked: Boolean
    email : String!
    lang : String
    gender: String
    url : Url
    image: String
    roles : Array
  }

  # the schema allows the following query:
  type Query {
    user(username: String!): User
    users: [User]
  }

  # this schema allows the following mutation:
  type Mutation {
    addUser(input: UserInput!): User!
    updateUser(username:String!, input: UserInput!): User!
    deleteUser(username:String!): User!
    deleteUsers(users:Array!): [User]!
  }
`

module.exports = type
