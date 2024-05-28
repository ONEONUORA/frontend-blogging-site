import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-Animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import axios from "axios";
import LoadMoreDataBtn from "../components/load-more.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import UserCard from "../components/usercard.component";



const SearchPage = () =>{

        let { query } = useParams();

        let [blogs, setBlog ] =  useState(null);

        let [users, setUsers] = useState(null);

        const searchBlogs = ( {page = 1, create_new_arr = false} ) =>{

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {query, page})
            .then( async ( {data} ) => {
                let formattedData =  await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { query },
                    create_new_arr
                })
                       setBlog(formattedData);
            })
            .catch((err) => {
                console.log(err);
            });
        }


        const fetchUsers = () =>{
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users" , { query })
            .then(( {data: {users} } ) =>{
                setUsers(users);
            })
            .catch((err) => {
                console.log(err);
               
            });
        }



        useEffect(() =>{

            resetState();
            searchBlogs( { page: 1 , create_new_arr: true } );
            fetchUsers();
        }, [query])

        const resetState =() =>{
            setBlog(null);
            setUsers(null);

        }

        const UserCardWrapper = () =>{
            return(
                <>
                    {
                        users == null ? <Loader/> 

                        :

                         users.length ?
                            users.map((user, i) =>{
                                return  <AnimationWrapper key={i} transition={{ duration: 1 , delay: i *0.08}}>
                                    <UserCard user={user}/>
                                </AnimationWrapper>
                            })
                            :
                             <NoDataMessage message= "No User Found"/>
                    }
                </>
            )
        }

    return(
      <>
                <section className="h-cover section1">
                    <div className="w-100" >
                        <InPageNavigation routes={[`Search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]} >
           
                        <>
                            {blogs == null ? (
                                      <Loader/>
                                   ) : (
                                        blogs.results.length ? 
                                        blogs.results.map((blog, i) => {
                                            return (
                                                <AnimationWrapper  transition={{ duration: 1, delay: i * .1}} key={i}>
                                                       <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                                </AnimationWrapper>
                                            );
                                        }) : 
                                        <NoDataMessage message='No blogs has been published yet!'/>
                                    )}

                                    <LoadMoreDataBtn state={blogs}  fetchDataFun={searchBlogs}/>
                        </>

                        <UserCardWrapper/>
                        </InPageNavigation>
                    </div>

                    <div className="searchuser">
                                    <h6>User related to search <i className="bi bi-person"></i></h6>
                                    <UserCardWrapper/>
                    </div>
                </section>
            
      </>
    )
}

export default SearchPage;