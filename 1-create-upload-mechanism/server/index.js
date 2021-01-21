const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const  dotenv = require('dotenv');
dotenv.config();

// Mongoose
const PostModel = mongoose.model('Post', {
    title: String,
    body: String,
    imageUrl: String
});

// GraphQL
const typeDefs = gql`
    type Post {
        title: String!
        body: String!
        imageUrl: String!
        id: ID!
    }
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
        url: String!
    }

    type Query {
        posts: [Post]
    }
    type Mutation {
        createPost(title: String!, body: String!, image: Upload!): Post
    }
`;

const resolvers = {
    Query: {
        posts: () => PostModel.find(),
    },
    Mutation: {
        createPost: async (parent, {title, body, image}) => {
            const {createReadStream, filename, mimetype, encoding} = await image.file;
            const stream = createReadStream();
            // TODO - save the file and return url
            const post = new PostModel({title, body, imageUrl: 'https://source.unsplash.com/random'});
            await post.save();
            console.log('post created: ', post);
            return post;
        },
    },
};


const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(
    process.env.DB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function() {
        console.log('mongoose connected!');
        server.listen().then(({ url }) => {
            console.log(`🚀  Server ready at ${url}`);
        });
    });


