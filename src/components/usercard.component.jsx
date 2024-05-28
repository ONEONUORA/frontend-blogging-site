import { Link } from "react-router-dom";



const UserCard  = ( {user} ) =>{

    let { personal_info: { fullname, username, profile_img}}  = user;

    return(
        <>
         <Link to={`/user/${username}`} className="d-flex gap-2 items-center mb-2">
                    <img src={profile_img} className="rounded-circle" style="width: 3.5rem; height: 3.5rem;" alt={fullname}/>

            <div>
                <h1 className="usercard">{fullname}</h1>
                <p className="text-dark">@{username}</p>
            </div>
         </Link>
        </>
    )
}

export default UserCard