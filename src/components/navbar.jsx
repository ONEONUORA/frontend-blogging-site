import { Link, Outlet, useNavigate } from 'react-router-dom'
import  logo from '../assets/utlimate one.jpg'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../App'
import UserNavigationPanel from './user-navigation.component'
import axios from 'axios'


const Navbar=()=>{

  const [searchBoxVisibility , setSearchBoxVisibility]  = useState(false)

    const [userNavPanel , setUserNavPanel] = useState(false)


    let navigate = useNavigate();

    const {userAuth, userAuth: {access_token, profile_img, new_notification_available}, setUserAuth} = useContext(UserContext);


    useEffect(() => {

      if(access_token){
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification" , {
          headers:{
            "Authorization": `Bearer ${access_token}`
          }
        })
        .then(( { data } ) => {
              setUserAuth({...userAuth, ...data})
        })
        .catch(err => {
          console.log(err)
        })
      }


    }, [access_token])

    const handleUserNavPanel = () =>{
          setUserNavPanel(currentVal => !currentVal);
    }

    const handleSearchFunction = (e)=> {

      let query = e.target.value

      if(e.keyCode == 13 && query.length){
        navigate(`/search/${query}`)
      }
    }

    const handleBlur =()=>{
      setTimeout(()=>{
          setUserNavPanel(false);
      }, 200);

    }

    return(
     <>
          
          <nav className="navbar navbar-expand-lg ">
                    <div className="container">
                      <Link to='/' className="navbar-brand" href="#">
                            <img src={logo} alt="Brand Logo" style={{width:'60px', height:"70px", borderRadius:"50%", marginBottom:'5px'}}/>
                      </Link>

                      {new_notification_available}
                      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                      </button>
                      <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                          <li className="nav-item">
                             <form className={`d-flex flex-grow-1  ${searchBoxVisibility ? "show" : "hide"} `}>
                                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{backgroundColor:'rgb(220, 217, 217)'}}
                                     onKeyDown={handleSearchFunction}

                                  />
                             </form>
                          </li>
       
                        </ul>
             
                        <div className="d-flex gap-2 write" role="search">

                              <div style={{padding:'10px'}}
                                    onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}
                                    >
                                      <i className="bi bi-search" style={{cursor:'pointer'}}></i>
                             </div>
                           
                             <Link to='/editor' style={{display:'flex', gap:'1px', textDecoration:'none', color:'gray'}}>
                               <i className="bi bi-pencil-square  py-1 px-1" style={{fontSize:'1.1rem', marginTop:'2px'}}></i>
                               <h6 className='' style={{marginTop:'10px'}}>Write</h6>
                             </Link>

                            {
                              access_token ?

                              <>
                                <Link to='/dashboard/notificationS'>
                                  <button className='btn face' style={{marginTop:"4px"}}>
                                      <i className="bi bi-bell" style={{fontSize:'1.1rem'}}></i>

                                      {
                                        new_notification_available ?
                                        <span className='bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2'></span>
                                        : 
                                        " "
                                      }
                             
                                      
                                  </button>
                                </Link>

                               <div className='relative' onClick={handleUserNavPanel} onBlur={handleBlur} style={{display:"block", textAlign:'start'}}>
                                      <button className='btn face1' style={{width: '3rem', height: '2.5rem'}}>
                                           <img src={profile_img}
                                            className='img-fluid rounded-circle'
                                            />
                                      </button>

                                  {
                                    userNavPanel ? <UserNavigationPanel/>

                                    : ""
                                  }

                              </div>
                              </>

                              :

                              <>
                                  <Link to='/signin'><button className="btn btn-dark me-2" type="submit">Sign In</button></Link>  
                                  <Link to='/signup'><button className="btn btn-outline-dark me-2" type="submit">Sign Up</button></Link>
                              </>
                            }

                        </div>

                       
                 </div>
            </div>
            
        </nav>
        <div className='navbar2'></div>
        <Outlet/>
    </>
    )
}

export default Navbar