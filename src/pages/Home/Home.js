import { useState, useEffect } from "react";
import { Client, DEFAULT_SERVER_ERROR_MESSAGE, ApiError } from "api";
import Header from "components/Header";
import CreatePost from "components/Post/CreatePost";
import Post from "components/Post/Post";

const navigation = [
  {
    name: "Posts",
    to: "/home",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const { posts } = await Client.getPosts();
      setPosts(posts);
    } catch (err) {
      let message = DEFAULT_SERVER_ERROR_MESSAGE;
      if (err instanceof ApiError) {
        message = err.message;
      }
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Header navigation={navigation} />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Posts
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <CreatePost getPosts={getPosts} />
              <div className="px-4 flex flex-wrap sm:px-0">
                {posts.map((post) => (
                  <Post post={post} key={post.id} getPosts={getPosts} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
