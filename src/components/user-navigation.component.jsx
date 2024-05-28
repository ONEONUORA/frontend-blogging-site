import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-Animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";



const UserNavigationPanel = () =>{

            const {userAuth: {username}, setUserAuth} = useContext(UserContext);
            const signOutUser =()=>{
                removeFromSession("user");
                setUserAuth({access_token: null})

            }
    return(
        <>
            <AnimationWrapper
                className='userface'
                transition={{duration: 0.2}}
         
            >
            
             

            <div className="signOutBtn" style={{ backgroundColor: 'white', width: '5rem',height:'rem', transition: 'all 0.3s'}}>


                                       <Link to={`/user/${username}`} className="link pl-2 py-2">
                                           Profile
                                         </Link>

                                       <Link to='/dashboard/blogs' className="link pl-2 py-2" >
                                           Dashboard
                                       </Link>

                
                                       <Link to='/settings/edit-profile' className="link pl-2 py-2">
                                           Settings
                                       </Link>

                                       <button className="button1"
                                               onClick={signOutUser}>
                                           <h6 style={{fontWeight:'bold'}}>Sign Out</h6>
                                           <p  className="text-dark-grey"><span>@</span>{username}</p>
                                       </button>

            </div>

            </AnimationWrapper>
        </>
    )
}


export default UserNavigationPanel;