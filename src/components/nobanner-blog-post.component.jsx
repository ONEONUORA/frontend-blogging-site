import { Link } from "react-router-dom";
import { getDay } from "../common/date";




const MinimalBlogPost = ({ blog , index}) =>{

    let {title, blog_id: id, author: {personal_info:{ fullname, username, profile_img }}, publishedAt} = blog;

    return(
        <>
            <Link  to={`/blog/${id}`} className="post2" >
                <h3 className="blog-index">{ index < 10 ? "0" +  (index + 1)  :  index}</h3>

                <div>
                   <div className="d-flex gap-2 align-items-center">
                        <img src={profile_img} className=" rounded-circle" style={{width:'20px'}}/>
                        <p className="bloguser">{fullname} @{username}</p>
                        <p className="blogpublish">{getDay(publishedAt)}</p>
                    </div>

                    <h1 className="blog-title">{ title }</h1>
                </div>
            </Link>
        </>
    )
}

export default MinimalBlogPost;