# 1. Create upload file mechanism

## Client 
[resource](https://www.apollographql.com/blog/graphql-file-uploads-with-react-hooks-typescript-amazon-s3-tutorial-ef39d21066a2/)

#### Install [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client)
````
npm install apollo-upload-client
````

import createUploadLink

````javascript
import { createUploadLink } from 'apollo-upload-client'
````
#### Update ApolloClient uri to upload link
```javascript
const client = new ApolloClient({
	//from:
	//uri: isDev ? 'http://localhost:4000/graphql' : '/graphql/',
	//to:
	link: new createUploadLink({uri: isDev ? 'http://localhost:4000/graphql' : '/graphql/'}),
	cache: new InMemoryCache()
});
```
#### update GET_POSTS query
````javascript
const GET_POSTS = gql`
    query {
        posts {
            title
            body
            imageUrl /* new field */ 
            id
        }
    }
`;
````
#### update CREATE_POST mutation
````javascript
const CREATE_POST = gql`
    mutation createPost($title: String!, $body: String!, $image: Upload! /* new value */ ) {
        createPost(title: $title, body: $body, image: $image /* new value */ ) {
            id
            title
            body
            imageUrl /* new field */ 
        }
    }
`;
````

#### Update PostList widget to show image
```javascript
function PostsList() {
    const { loading, error, data, refetch } = useQuery(GET_POSTS);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <>
            <button onClick={() => refetch()}>Refetch!</button>
            {data.posts.map((post) => (
                <div>
                    <h3>{post.title}</h3>
                    <div>{post.body}</div>
                    <img src={post.imageUrl} alt={post.title} /> /* new field */
                </div>
            ))}
        </>

    );
}
```
#### Update CreatePost widget
```javascript
function CreatePost() {
    const [createPost] = useMutation(CREATE_POST);
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    // new field
    const [image, setImage] = React.useState(null);
    // image change handler
    const onImageChange = ({target: {validity, files: [file]}}) =>
        validity.valid && setImage({ file });
    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    createPost({ variables: { title, body, image } });
                    setBody('');
                    setTitle('');
                }}
            >
                <label>Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} />
                <label>Body</label>
                <input type="text" required value={body} onChange={e => setBody(e.target.value)} />
                {/* new file input */}
                <input type="file" required onChange={onImageChange} />
                <button type="submit">Add Post</button>
            </form>
        </div>
    );
}
```


## Server

#### Update PostModel
```javascript
const PostModel = mongoose.model('Post', {
    title: String,
    body: String,
    imageUrl: String /* new field */
});
```
#### Update typeDefs, using **Upload** type for the input file
```javascript
const typeDefs = gql`
    type Post {
        title: String!
        body: String!
        imageUrl: String! /* new field */ 
        id: ID!
    }
    type Query {
        posts: [Post]
    }
    type Mutation {
        createPost(title: String!, body: String!, image: Upload! /* new field */ ): Post
    }
`;
```
#### Update resolvers
```javascript
const resolvers = {
    // ...
    Mutation: {
        createPost: async (parent, {title, body, image /* new field */ }) => {
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
```
