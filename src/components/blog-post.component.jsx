

import { Link } from "react-router-dom";
import { getDay } from "../common/date";



const BlogPostCard = ({ content, author }) =>{

    let {publishedAt, tags, title, des, banner, activity:{ total_likes }, blog_id: id}  = content;
    let { fullname, profile_img, username } = author; 
    
    return(
      <>
            <Link to={`/blog/${id}`} className="post1">
                <div className="w-100">
                    <div className="d-flex gap-2 align-items-center">
                        <img src={profile_img} className=" rounded-circle" style={{width:'20px'}}/>
                        <p className="bloguser">{fullname} @{username}</p>
                        <p className="blogpublish">{getDay(publishedAt)}</p>
                    </div>

                    <h1 className="blog-title">{title}</h1>
                    <p className="des">{des}</p>

                    <div className="d-flex gap-3 mt-3 mb-5">
                        <span className=" btn btn-light1">{tags[0]}</span>
                        <span className=" d-flex items-center gap-2 text-danger">
                            <i className="bi bi-heart " style={{marginTop:'2px'}} ></i>
                            { total_likes }
                        </span>
                    </div>
                </div>

                <div className="banner1">
                        <img src={banner} className="banner2"/>
                </div>
            </Link>
      </>
    )
}


export default BlogPostCard;