import { useContext } from "react";
import { Editorcontext } from "../pages/editor.pages";



const Tag = ({ tag, tagIndex}) =>{

    let {blog, blog: { tags }, setBlog} = useContext(Editorcontext);

    const addEditable =(e)=>{
        e.target.setAttribute("contentEditable", true)
        e.target.focus();
    }

    const handleTagEdit =(e)=>{
        if(e.keyCode == 13 || e.keyCode == 188){

            e.preventDefault();

                let currentTag = e.target.innerText;

                tags[tagIndex] = currentTag;

                setBlog({...blog, tags});

                e.target.setAttribute("contentEditable", false )
           

        }
    }

    const handleTagDelete = ()=>{

            tags = tags.filter( t => t != tag);
            setBlog({ ...blog, tags})
    }

    return(

        <div className="tag">

            <p className="outTag" onKeyDown={handleTagEdit} onClick={addEditable}>{ tag }</p>

            <button
               className="tag1"
               onClick={handleTagDelete}
            >
                <i className="bi bi-x-lg "></i>
            </button>
        </div>
    )
}

export default Tag;