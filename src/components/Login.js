import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import "./Login.css";
import Employee from "./Employee";
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setSuccess(true);
      // return <Navigate to={"/employee"} />
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    


    try {
      const response = await axios.post(
        "create-token/",
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.access;
      localStorage.setItem("accessToken", accessToken);
      // const roles = "A"
      // setAuth({ user, pwd, roles, accessToken });
      console.log("SUCESS");
      setUser("");
      setPwd("");
      setSuccess(true);
      navigate('/employee');
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response", err?.response);
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
    <div  align='center' style={{
        marginTop:'25vh'
    }} className="main-1">
      <div className="container-1">
        {success ? (
          <section className="content-section">
            <h1>Hello</h1>
            <br/><span>Your are logged in</span>
            <p>
              <a href="/employee">Employee Management</a>
            </p>
          </section>
        ) : (
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <div className="form" id="login">
              <h1 className="form__title">Welcome back</h1>
              <form onSubmit={handleSubmit}>

              <div className="form__input-group">
                <input
                  type="text"
                  id="username"
                  className="form__input"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Username"
                  value={user}
                  required
                  />
              </div>
              <div className="form__input-group">
                <input
                  type="password"
                  id="password"
                  className="form__input"
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="password"
                  value={pwd}
                  required
                  />
                <div className="padding"></div>
                <a href="#">
                  <button className="form__button" type="submit" id="loginButton">
                    Login
                  </button>
                </a>
              </div>
                  </form>
            </div>
          </section>
        )}
      </div>
      </div>
    </>
  );
};

export default Login;
