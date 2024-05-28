import AnimationWrapper from "../common/page-Animation";
import candle from '../assets/candle.png'
import InputBox from "../components/input";
import { Link, Navigate } from "react-router-dom";
import { useContext} from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {

  // const authForm = useRef();

  let { userAuth: {access_token} , setUserAuth} = useContext(UserContext)

    console.log(access_token)

  const userAuthThroughServer = (serverRoute, formData) => {
   

       axios .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data))
        setUserAuth(data)
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email***********************
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password***************************

    //formdata****************************************************

    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    //form validation/////**************************************************** */

    if(fullname){

        if(fullname.length < 3){
            return  toast.error("Fullname must be at least 3 letters long")
        }
      }


    if (!email.length) {
      return toast.error("Enter Email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is Invalid");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 - 20 characters long with a numeric, 1 lowercase and 1 uppercase letters "
      );
    }
    userAuthThroughServer(serverRoute, formData);
  }

  const handleGoogleAuth =  (e) =>{

    e.preventDefault();

   authWithGoogle().then(user=>{
        let serverRoute = "/google-auth";

        let formData = {
            access_token:user.accessToken
        }

        userAuthThroughServer(serverRoute, formData)
    

   })

   .catch(err => {
        toast.error('Trouble login through  Google');
        return console.log(err)
   })
 
  }

  return (
    access_token ?
        <Navigate to='/'/>
    :
    <AnimationWrapper keyValue={type}>
      <section
        className="mt-3 d-flex align-items-center justify-content-center"
        style={{}}
      >
        <Toaster />
        <form id="formElement" className="forminput">
          <img src={candle} alt="image" style={{width:'80px', display:'block', margin:'0 auto'}}/>
          <h3 className="text-4xl text-center mb-4 mt-3">
            {type == "sign-in" ? "Hello Again!" : "Join The Adventure"}
          </h3>

          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="bi-person"
            />
          ) :

           (" ")}

          <InputBox
            name="email"
            type="email"
            placeholder="E-mail"
            icon="bi-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="bi-key"
          />

          <button
            className="btn btn-dark1"
            type="submit"
            onClick={handleSubmit}
          >
            { type.replace("-", " ")}
          </button>

          <div className="position-relative w-100 d-flex gap-2 my-10 text-uppercase text-black font-weight-bold">
            <hr className="line2" />
            <p className="mt-3">OR</p>
            <hr className="line2" />
          </div>

          <button className="btn btn-dark2"
          onClick={handleGoogleAuth}
          >
            <i
              className="bi bi-google"
              style={{ color: "red", paddingRight: "5px" }}
            ></i>
            Continue With Google
          </button>

          {type == "sign-in" ? (
            <p
              className="in"
              style={{
              
                textAlign: "center",
                paddingTop: "10px",
              }}
            >
              Dont have an account ?
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Register Today
              </Link>
            </p>
          ) : (
            <p
              className="out"
              style={{
                display: "flex",
                gap: "10px",
                textAlign: "center",
                paddingTop: "10px",
              }}
            >
              Already a member ?
              <Link to="/signin" style={{ textDecoration: "none" }}>
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
