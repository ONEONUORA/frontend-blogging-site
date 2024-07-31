import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
// import { BlogContext } from "../pages/blog.page";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setLikedByUser ,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      //making request to the server to get liked info
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",
          { _id },
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          },
        )
        .then(({ data: { result } }) => {
             setLikedByUser(Boolean(result));
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  const handleLike = () => {
    if (access_token) {
         setLikedByUser(preVal => !preVal);

      !isLikedByUser ? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...activity, total_likes } });

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
          { _id, isLikedByUser },
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          },
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Pls login to like this blog!!!");
    }
  };
  return (
    <>
      <Toaster />
      <hr className="my-2 border-grey" />

           <div className="flex gap-6 justify-between">
                <div className="flex items-center gap-3">
    
            <button
              onClick={handleLike}
              className={
                "flex h-10 w-10 items-center justify-center rounded-full " +
                (isLikedByUser ? "bg-red/20 text-red " : "bg-grey/80")
              }
            >
              <i
                className={
                  "bi " + (isLikedByUser ? "bi-heart-fill" : "bi-heart")
                }
              ></i>
            </button>

            <p className="text-xl text-dark-grey">{total_likes}</p>
     
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-grey/80"
              onClick={() => setCommentsWrapper(preVal => !preVal)}
            >
              <i className="bi bi-chat-dots"></i>
            </button>

            <p className="text-dark text-xl">{total_comments}</p>
        
                </div>


              <div className="flex items-center gap-6">
                   {/* {
                           username == author_username ? (
                      <Link
                              to={`/editor/${blog_id}`}
                             className="underline hover:text-purple"
                            >
                                  Edit
                      </Link>
                 ) : (
                   " "
                 )} */}
                    {
                      username == author_username ?
                      <Link
                              to={`/editor/${blog_id}`}
                             className="underline hover:text-purple"
                            >
                                  Edit
                      </Link> : ""
                    }

                    <Link
                      to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
                      target="_blank"
                    >
                      <i className="bi bi-twitter-x text-xl hover:text-twitter"></i>
                    </Link>
                </div>
          </div>
      <hr className="my-2 border-grey" />
    </>
  );
};

export default BlogInteraction;
