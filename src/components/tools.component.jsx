


////importing tools from package.jsons*****************************************************

// import Embed from "@editorjs/embed";
// import List from "@editorjs/list";
// import Image from "@editorjs/image";
// import Header from "@editorjs/header";
// import Quote from "@editorjs/quote"
// import Marker from "@editorjs/marker";
// import InlineCode from "@editorjs/inline-code";

// import { uploadImage } from "../common/aws";



// const uploadImageByFile = (e) =>{
//  return uploadImage(e).then(url => {
//     if(url) {
//         return {
//             success: 1,
//             file: { url }
//         }
//     }
//  })
// }


// const uploadImageByUrl =(e)=>{
//     let link = new Promise((resolve, reject) =>{
//         try{
//             resolve(e)
//         }
//         catch(err){
//             reject(err)
//         }
//     })


//     return link.then(url => {
//         return {
//             success: 1,
//             file: { url }
//         }
//     })
// }

// export const tools = {
//     embed: Embed,
    
//     list: {
//         class:List,
//         inlineToolbar: true
//     },
//     image: {
//         class:Image,
//         config:{
//             uploader:{
//                 uploadByUrl: uploadImageByUrl,
//                 uploadByFile:  uploadImageByFile,
//             }
//         }
//     },
//     header: {
//         class: Header,
//         config:{
//             placeholder: "Type Heading.......",
//             levels: [2, 3],
//             defaultLevel: 2
//         }
//     },
//     quote: {
//         class: Quote,
//         inlineToolbar: true
//     },

//     marker: Marker,
//     inlineCode: InlineCode
// }


import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import { uploadImage } from "../common/aws"; 
const uploadImageByFile = (file) => {
  return new Promise((resolve, reject) => {
    uploadImage(file)
      .then(url => {
        if (url) {
          resolve({
            success: 1,
            file: { url }
          });
        } else {
          reject({
            success: 0,
            message: "Image upload failed"
          });
        }
      })
      .catch(err => {
        console.error(err);
        reject({
          success: 0,
          message: "Image upload failed"
        });
      });
  });
};

const uploadImageByUrl = (url) => {
  return new Promise((resolve, reject) => {
    
    try {
      new URL(url); 
      resolve({
        success: 1,
        file: { url }
      });
    } catch (err) {
      console.error("Invalid URL:", err);
      reject({
        success: 0,
        message: "URL upload failed"
      });
    }
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile // Fixing the naming here
      }
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading.......",
      levels: [2, 3],
      defaultLevel: 2
    }
  },
  quote: {
    class: Quote,
    inlineToolbar: true
  },
  marker: Marker,
  inlineCode: InlineCode
};

