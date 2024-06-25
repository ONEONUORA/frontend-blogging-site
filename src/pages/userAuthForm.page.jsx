/* eslint-disable react/prop-types */
import AnimationWrapper from "../common/page-Animation";
import candle from "../assets/candle.png";
import InputBox from "../components/input";
import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  // const authForm = useRef();

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  console.log(access_token);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
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

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long");
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
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";

        let formData = {
          access_token: user.accessToken,
        };

        userAuthThroughServer(serverRoute, formData);
      })

      .catch((err) => {
        toast.error("Trouble trying to login through google");
        return console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
            <section
                 className="h-cover flex items-center justify-center"
            >
               <Toaster />
               <form id="formElement" className="w-[80%] max-w-[400px]">
          <img
            src={candle}
            alt="image"
            style={{ width: "80px", display: "block", margin: "0 auto" }}
          />
          <h1 className="text-4xl font-gelasio capitalize text-center mb-10 mt-3" >
            {type == "sign-in" ? "Hello Again!" : "Join The Adventure"}
          </h1>

          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="bi-person"
            />
          ) : (
            " "
          )}

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
            className="btn-dark mt-14 center"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full items-center gap-2 my-10 opacity-10 flex uppercase text-black font-bold" >
            <hr className="w-1/2 border-black"  />
            <p className="">or</p>
            <hr className="w-1/2 border-black"  />
          </div>

          <button className="btn-dark  flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth}>
            <i
              className="bi bi-google"
              style={{ color: "red"}}
            ></i>
            Continue With Google
          </button>

          {type == "sign-in" ? (
            <p className=" mt-6 text-dark-grey text-xl text-center" >
              Dont have an account ?
              <Link to="/signup"  className="underline text-black text-xl ml-1">
                Register Today
              </Link>
            </p>
          ) : (

            <p className="mt-6 text-dark-grey text-xl text-center"
            >
              Already a member ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
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
