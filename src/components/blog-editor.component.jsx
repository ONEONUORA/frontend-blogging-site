

import {Link, useNavigate, useParams} from "react-router-dom"
import logo from "../assets/utlimate one.jpg"
import AnimationWrapper from "../common/page-Animation"
import defaultBanner from '../assets/Blog Banner.png'
import { uploadImage } from "../common/aws"
import { useContext, useEffect } from "react"
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
            holder: "textEditor",
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
          console.log(input.scrollHeight);

          input.style.height = 'auto';
          input.style.height = input.scrollHeight + "px";

          setBlog({ ...blog, title:input.value })

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
                <nav className="navbar1">
                         <Link to='/'>
                            <img src={logo} alt="Brand Logo" style={{width:'60px', height:"70px", borderRadius:"50%", marginBottom:'5px'}}/>
                        </Link>

                     
                            
                             <h4 className="d-none d-md-block text-black overflow-hidden" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight:"bold", margin:"0 auto" }}> 
                                  { title.length ? title : "New Blog"}
                            </h4>
                      

        
                        <div className="d-flex gap-3  " style={{}}>
                               <button className="btn btn-dark py-2" 
                               onClick={handlePublishEvent}
                               >
                                  Publish
                               </button>

                              <button className="btn btn-light py-2 "
                              onClick={handleSaveDraft}
                              >
                                  Save Draft
                               </button>
                        </div>

                </nav>

                <Toaster/>
                <AnimationWrapper>
                    <section className="section1">

                        <div className="container max-width-custom">
                           
                            <div className="position-relative bg-white border border-4 border-secondary aspect-video hover-opacity">

                                <label htmlFor="UploadBanner">
                             
                                    <img
                                   
                                        src={banner}
                                        className="custom-z-index1"
                                        onError={handleError}
                                             
                                    />
                       
                                            <input  
                                               id="uploadBanner"
                                               type="file"
                                               accept=".png, .jpg, .jpeg"
                                               hidden
                                               onChange={handleBannerUpload}
                                            
                                             /> 
                           
                                </label>
                              </div>
                  
                            <textarea
                                   defaultValue={title}
                                   placeholder="Blog Title"
                                   className="textarea-style"
                                   onKeyDown={handleTitleKeyDown}
                                   onChange={handleTitleChange}
                            >
                           </textarea>

                               <div className="seperator"></div>

                               <div id="textEditor" className="font-gelasio"></div>
                        
                        </div>         
                    </section>
                </AnimationWrapper>

                


        </>
              

    )
}

export default BlogEditor


