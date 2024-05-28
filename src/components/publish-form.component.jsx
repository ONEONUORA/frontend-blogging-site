import { useContext } from "react"
import AnimationWrapper from "../common/page-Animation"
import  { Toaster,toast } from "react-hot-toast"
import { Editorcontext } from "../pages/editor.pages"
import Tag from "./tags.component"
import axios from "axios"
import { UserContext } from "../App"
import { useNavigate, useParams } from "react-router-dom"



const PublishForm = () =>{

        let characterLimit = 200;

        let tagLimit = 10;

        let { blog_id } = useParams();

        let { blog, blog:{banner, title, tags, des, content},setEditorState, setBlog} = useContext(Editorcontext)

        let { userAuth: { access_token}} = useContext(UserContext);

        let navigate = useNavigate();


        const handleCloseEvent =()=>{
            setEditorState("editor")
        }

        const handleBlogTitleChange = (e) =>{
            let input = e.target;

            setBlog({...blog, title: input.value})
        }

        const handleBlogDesChange = (e)=>{
            let input = e.target;
            setBlog({...blog, des: input.value})


        }

        const handleTitleKeyDown = (e) =>{
         
            if(e.keyCode == 13){//enter key
              e.preventDefault();
  
            }
          }

          const handleKeyFunction=(e)=>{
                if(e.keyCode == 13 || e.keyCode == 188){
                    e.preventDefault();
                    let tag = e.target.value;

                   if(tags.length < tagLimit){
                        if(!tags.includes(tag) && tag.length){
                                setBlog({...blog, tags: [ ...tags, tag ]})
                    }
                   }else{
                    toast.error(`You can add max ${tagLimit} tags`)
                   }

                   e.target.value = "";
                }
          }

          const publishBlog = (e) =>{

            if(e.target.className.includes("disable")) {
                return;
            }

            if(!title.length){
                return toast.error("Write blog title before publishing")
            }

            if(!des.length || des.length > characterLimit){
                return toast.error(`Write a short description within ${characterLimit}  characters to publish`)
            }

            if(!tags.length){
                return toast.error("Include at least one tag to help rank your blog")
            }

            let loadingToast = toast.loading("Publishing...");

                e.target.classList.add('disable');

                let blogObj ={
                    title, banner, des, content, tags, draft: false
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id: blog_id}, {
                    headers:{
                        'Authorization':`Bearer ${access_token}`
                    }
                } )
                .then(() =>{

                    e.target.classList.remove('disable');

                    toast.dismiss(loadingToast);
                    toast.success("Published 👍")

                    setTimeout(() =>{
                          navigate('/dashboard/blogs') 
                    }, 500);
                })

                .catch(( {response} ) => {
                    e.target.classList.remove('disable');
                    toast.dismiss(loadingToast);
                    return toast.error(response.data.error)
                })
          }

    return(
        <>
           <AnimationWrapper>
                <section className="section1">
                    <Toaster/>

                        <button className="publishButton"
                            onClick={handleCloseEvent}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>

                    <div className="center">
                            <p className="text-dark-gray mb-1 mt-2">Preview</p>

                            <div className="video-container">
                                <img src={banner}/>
                            </div>

                            <h1 className="text">{ title }</h1>
                            <p className="font-gelasio">{ des }</p>

                            <div className="defaul1t">
                                <p>Blog Title</p>
                                <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box1 "
                                    onChange={handleBlogTitleChange}
                                />

                                <p className="mt-5">Short description about your blog</p>

                                <textarea
                                    maxLength={characterLimit}
                                    defaultValue={des}
                                    className="h-40 resize-none leading-7 input-box2"
                                    onChange={handleBlogDesChange}
                                    onKeyDown={handleTitleKeyDown}
                                >
                                </textarea>

                                <p className="mt-1 text-dark-grey text-sm text-end">{characterLimit - des.length } characters Left</p>
                                <p className="mt-3">Topics - (Facilitate search and ranking of your blog posts )</p>
                            </div>

                            <div className="pl-2 py-2 pb-4 position-relative input-box4 ">
                                    <input type="text" placeholder="Topic" className=" input-box3 bg-white fixed-top  mb-2 mt-2"
                                        onKeyDown={handleKeyFunction}
                                    />

                                   {
                                    tags.map((tag, i) =>{
                                       return <Tag tag={tag} tagIndex={i} key={i}/>
                                    })
                                   }              
                            </div>
                            <p className="mt-1 text-dark-grey text-sm text-end">{tagLimit - tags.length} Tags Left</p>

                            <button className="btn btn-dark px-8 send"
                            onClick={publishBlog}
                            >Publish</button>
                    </div>
                </section>
           </AnimationWrapper>
        </>
    )
}

export default PublishForm