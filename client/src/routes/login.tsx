import React, {useState} from 'react';
import "./styles.css";
import {useNavigate} from 'react-router-dom';
import {AuthService, ErrorCode} from '@genezio/auth';
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setGoogleLoginLoading(true);
    try {
      await AuthService.getInstance().googleRegistration(
        credentialResponse.credential!
      );

      console.log("Login Success");
      navigate("/");
    } catch (error: any) {
      console.log("Login Failed", error);
      alert("Login Failed");
    }
    setGoogleLoginLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);

    try {
      await AuthService.getInstance().login(email, password);
      navigate("/");
    } catch (error: any) {
      if (error.code === ErrorCode.INCORRECT_EMAIL_OR_PASSWORD) {
        alert('Incorrect email or password');
      } else {
        console.log('Login Failed', error);
        alert('Login Failed');
      }
    }
    setLoginLoading(false);
  };

  return (
    <>
      <div className="form-container">
        {googleLoginLoading ? (
          <>Loading...</>
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
              alert("Login Failed");
            }}
            theme="filled_black"
            shape="circle"
          />
        )}
      </div>

      <div className="division">
        <div className="line-left"></div>
        <div className="or">OR</div>
        <div className="line-right"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <label>
          <a href="/forgot-password" style={{color:"white"}}>Forgot password?</a>
        </label>
        <button type="submit">
          {loginLoading ? "Loading..." : "Login"}
        </button>
        <button onClick={() => navigate('/signup')}>Create an account</button>
      </form>
    </>
  );
};

export default Login;