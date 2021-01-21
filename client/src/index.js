import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_POSTS = gql`
    query {
        posts {
            title
            body
            imageUrl
            id
        }
    }
`;

const CREATE_POST = gql`
    mutation createPost($title: String!, $body: String!, $image: Upload!) {
        createPost(title: $title, body: $body, image: $image) {
            id
            title
            body
            imageUrl
        }
    }
`;
const isDev = process.env.NODE_ENV === 'development';
const client = new ApolloClient({
    //from:
    //uri: isDev ? 'http://localhost:4000/graphql' : '/graphql/',
    //to:
    link: new createUploadLink({uri: isDev ? 'http://localhost:4000/graphql' : '/graphql/'}),
    cache: new InMemoryCache()
});

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
                </div>
            ))}
        </>

    );
}


function CreatePost() {
    const [createPost] = useMutation(CREATE_POST);
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    const [image, setImage] = React.useState(null);
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
                <button type="submit">Add Post</button>
                <input type="file" required onChange={onImageChange} />
            </form>
        </div>
    );
}

function App() {
    return (
        <ApolloProvider client={client}>
            <div>
                <h2>My first Apollo app 🚀</h2>
                <CreatePost />
                <PostsList />
            </div>
        </ApolloProvider>
    );
}

render(<App />, document.getElementById('root'));
