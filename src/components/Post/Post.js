import moment from "moment";
import { Trash2, Edit2 } from "react-feather";
import DeletePost from "components/Post/DeletePost";
import UpdatePost from "components/Post/UpdatePost";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "store/user";

export default function Post({ post, getPosts, ...props }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [currentPost, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userStore = useRecoilValue(userState);

  const userInitials = (user) => {
    return `${user.firstName.charAt(0).toUpperCase()}${user.lastName
      .charAt(0)
      .toUpperCase()}`;
  };

  const deleteRow = (post) => {
    setPost(post);
    setDeleteOpen(true);
  };

  const updateRow = (post) => {
    setPost(post);
    setUpdateOpen(true);
  };

  return (
    <div
      className="bg-primary-300 mt-3 p-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/3 mb-4"
      {...props}
    >
      <div className="p-5 bg-gray-300 rounded-t-lg shadow">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
            <span className="text-xs font-medium leading-none text-white">
              {userInitials(post.User)}
            </span>
          </span>
          <h3 className="ml-2 mt-2 text-lg leading-6 font-medium text-gray-900">
            {post.User.firstName}
            <span className="pl-2">{post.User.lastName}</span>
          </h3>
          <p className="ml-2 mt-1 text-sm text-gray-500 truncate">
            {moment(post.createdAt).format("MMMM Do, h:mm:ss a")}
          </p>
        </div>
      </div>
      {post.image && (
        <img
          className="border object-cover min-w-full"
          src={post.image}
          alt={post.image}
        />
      )}
      <div className="bg-gray-200 shadow p-5 text-xl text-gray-500 content-center font-medium flex flex-row flex-wrap">
        <div className="w-full">{post.body}</div>
      </div>
      {post.User.id === userStore.user.id && (
        <div className="p-3 bg-gray-300 rounded-b-lg shadow">
          <div className="-ml-2 -mt-2 flex  w-full justify-items-end">
            <span
              className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-500"
              onClick={updateRow.bind(this, post)}
            >
              <span className="text-xs font-medium leading-none text-white">
                <Edit2 size={15} />
              </span>
            </span>
            <span
              className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-300 ml-2"
              onClick={deleteRow.bind(this, post)}
            >
              <span className="text-xs font-medium leading-none text-white">
                <Trash2 size={15} />
              </span>
            </span>
          </div>
        </div>
      )}
      {currentPost && (
        <>
          <DeletePost
            open={deleteOpen}
            setOpen={setDeleteOpen}
            post={currentPost}
            setPost={setPost}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            getPosts={getPosts}
          />
          <UpdatePost
            open={updateOpen}
            setOpen={setUpdateOpen}
            post={currentPost}
            setPost={setPost}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            getPosts={getPosts}
          />
        </>
      )}
    </div>
  );
}
