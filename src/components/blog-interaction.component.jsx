import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
// import { BlogContext } from "../pages/blog.page";




const BlogInteraction = ()=>{

    let {blog, blog: {_id, title, blog_id, activity, activity: {total_likes, total_comments}, author: {personal_info:{ username: author_username} } }, setBlog , isLikedByUser, setLikedByUsers, setCommentsWrapper} = useContext(BlogContext);

    let { userAuth: { username, access_token }} = useContext(UserContext);

    useEffect(() =>{
        if( access_token){
          //making request to the server to get liked info
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user" , {_id}, 
            {headers:{
                  "Authorization" : `Bearer ${access_token}`
            }
          })
         .then(({data: {result} }) =>{
            setLikedByUsers(Boolean(result))
         })
         .catch(err => {
            console.log(err)
         })
        }
    }, [])

    const handleLike = () =>{
      if(access_token){

          setLikedByUsers(preVal => !preVal);

          !isLikedByUser ? total_likes+1 : total_likes-1

          setBlog({...blog, activity:{...activity, total_likes}})

          axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", {_id, isLikedByUser},{
            headers: {
              "Authorization": `Bearer ${access_token}`
            }
          })
          .then(({data}) =>{
              console.log(data)
          })
          .catch(err =>{
            console.log(err)
          })

      }else{
          toast.error("Pls login to like this blog")
      }
    }
    return(
        <>
            <Toaster/>
            <div className="mb-1" style={{border:'1px  solid grey'}}></div>
                <div className="d-flex gap-2 justify-between">

                    <div className="d-flex gap-2 items-center">

                                <button
                                  onClick={handleLike}
                                  className={"w-10 h-10 rounded-full d-flex items-center justify-center " + ( isLikedByUser ? " text-danger bg-white" : "bg-grey ")}
                                >
                                   <i className={"bi " + (isLikedByUser ? "bi-heart-fill" : "bi-heart") }></i>
                                </button>

                                <p className="text-xl text-dark">{ total_likes }</p>
                       

                
                                <button
                                 className="w-10 h-10 rounded-full d-flex items-center justify-center bg-grey"
                                 onClick={() => setCommentsWrapper(preVal => !preVal)}
                                >
                                  <i className="bi bi-chat-dots"></i>
                                </button>

                                <p className="text-xl text-dark">{ total_comments }</p>
                    </div>

                </div>
                     
                    
                    <div className="d-flex gap-2 items-center">
                      {
                        username == author_username ? 
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : " "
                      }


                         <Link to={`https://twitter.com/intent/tweet?text=Read ${title} &url=${location.href}`} target="_blank"><i className="bi bi-twitter-x text-xl hover: text-twitter"></i></Link>
                    </div>
            <div className="mt-1" style={{border:'1px solid grey'}}></div>
        </>
    )
}

export default BlogInteraction;