

import {Link, useNavigate, useParams} from "react-router-dom"
import logo from "../assets/reactkdlogo.jpg"
import AnimationWrapper from "../common/page-Animation"
import defaultBanner from '../assets/reactbanner.jpg.jpg'
import { uploadImage } from "../common/aws"
import { useContext, useEffect} from "react"
import {Toaster, toast} from 'react-hot-toast'
import { Editorcontext } from "../pages/editor.pages"
import EditorJS from "@editorjs/editorjs"
import { tools } from "./tools.component"
import axios from "axios"
import { UserContext } from "../App"


const BlogEditor = () =>{

      
         let { blog, blog: {title, banner, content, tags, des}, setBlog, textEditor, setTextEditor, setEditorState} = useContext(Editorcontext)
      
        let { userAuth: { access_token}} = useContext(UserContext)
        let {blog_id} = useParams()
        let navigate =  useNavigate()

       //useEffect for blog editor**************************************************
       useEffect(() =>{
        if(!textEditor. isReady){
          setTextEditor(new EditorJS({
            holderId: "textEditor",
            data:  Array.isArray (content) ? content[0] : content,
            tools: tools,
            placeholder: 'Enlighten The World'
          })) 
        }

       }, [])


        const handleBannerUpload = (e) =>{
                let img = e.target.files[0];
        
            if(img){

                let loadingToast = toast.loading("Uploading...")

                uploadImage(img).then((url) =>{
                  if(url){
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded Successfully 👍");
                    setBlog({...blog, banner: url})
                  }
                })

                .catch(err => {
                  toast.dismiss(loadingToast);
                  return toast.error(err)
                })
            }
           
        }
        
        const handleTitleKeyDown = (e) =>{
       
          if(e.keyCode == 13){//enter key
            e.preventDefault();

          }
        }

        const handleTitleChange = (e)=>{
     
          let input = e.target;
         

          input.style.height = 'auto';
          input.style.height = input.scrollHeight + "px";

          setBlog({ ...blog, title: input.value })

        }

        const handleError = (e) =>{
          let img = e.target;
           img.src = defaultBanner;
        }

        const handlePublishEvent = () =>{

          if(!banner.length){
            return toast.error("Upload a blog banner before publish")
          }

          if(!title.length){
            return toast.error("Write a blog title before publish")
          }

          if(textEditor.isReady){
            textEditor.save().then(data => {
              if(data.blocks.length){
                  setBlog({ ...blog, content: data});
                  setEditorState("publish")
              }else{
                return toast.error("Craft your thoughts and ideas into captivating stories before you hit the publish button")
              }
            })
            .catch((err) =>{
              console.log(err);
            })
          }

        }



        const handleSaveDraft = (e) => {
          if (e.target.className.includes("disable")) {
              return;
          }
      
          if (!title.length) {
              return toast.error("Write blog title before saving it as a draft");
          }
      
          let loadingToast = toast.loading("Saving draft...");
      
          e.target.classList.add('disable');
      
          if (textEditor.isReady) {
              textEditor.save().then(content => {
                
                  let blogObj = {
                      title, banner, des, content, tags, draft: true
                  };
      
                  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id: blog_id}, {
                      headers: {
                          'Authorization': `Bearer ${access_token}`
                      }
                  }).then(() => {
                      e.target.classList.remove('disable');
                      toast.dismiss(loadingToast);
                      toast.success("Saved 👍");
                      setTimeout(() => {
                          navigate('/dashboard/blogs?tab=draft');
                      }, 500);
                  }).catch(({response}) => {
                      e.target.classList.remove('disable');
                      toast.dismiss(loadingToast);
                      return toast.error(response.data.error);
                  });
              }).catch(() => {
                  toast.dismiss(loadingToast);
                  return toast.error("Failed to save draft. Please try again.");
              });
          }
      };
      
          

    return(
        <>
                <nav className="navbar">
                   <Link to='/' className='flex-none w-20'>
                     <img src={logo} alt="Brand Logo" className='w-full'/>
                   </Link>

                        <p className="max-md:hidden text-black line-clamp-1 w-full"> 
                              { title.length ? title : "New Blog"}
                        </p>
                      
                        <div className="flex gap-4 ml-auto" >
                               <button className="btn-dark py-2" 
                               onClick={handlePublishEvent}
                               >
                                  Publish
                               </button>

                              <button  className="btn-light py-2"
                              onClick={handleSaveDraft}
                              >
                                  Save Draft
                               </button>
                        </div>
                </nav>

                <Toaster/>
                <AnimationWrapper>
                    <section>
                        <div className="mx-auto max-w-[900px] w-full">
                           
                            <div className="relative aspect-video hover:opacity-70 bg-white   border-4 border-grey">
                                <label htmlFor="UploadBanner">

                                    <img
                                        src={banner}  
                                        className="z-20"
                                        onError={handleError}  
                                  />
                       
                                            <input  
                                               id="uploadBanner"
                                               type="file"
                                               accept=".png, .jpg, .jpeg"
                                              // hidden
                                               onChange={handleBannerUpload}
                                                        
                                             /> 
                           
                                </label>
                              </div>
                  
                            <textarea
                                   defaultValue={title}
                                   placeholder="Blog Title"
                                   className="text-2xl font-medium w-full h-10 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"                       
                                   onKeyDown={handleTitleKeyDown}
                                   onChange={handleTitleChange}
                            >
                           </textarea>

                           <hr className="w-full opacity-5 my-5"/>

                          

                           <div id="textEditor" className="font-gelasio"></div>
                        
                        </div>         
                    </section>
                </AnimationWrapper>

                


        </>
              

    )
}

export default BlogEditor


