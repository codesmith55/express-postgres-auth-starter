import React, {useState} from 'react';
import "./styles.css";
import {useNavigate} from 'react-router-dom';
import {AuthService, ErrorCode} from '@genezio/auth';
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
    setLoading(true);
    try {
      const response = await AuthService.getInstance().register(email, password, name);
      console.log('Register Success', response);

      navigate('/login');
    } catch (error: any) {
      console.log(error);
      if (error.code === ErrorCode.EMAIL_ALREADY_EXISTS) {
        alert("Email already exists")
      } else if (error.code === ErrorCode.PASSWORD_CONTAINS_ONLY_NUMBER) {
        alert('Password contains only numbers');
      } else if (error.code === ErrorCode.PASSWORD_MUST_HAVE_AT_LEAST_ONE_SPECIAL_CHARACTER) {
        alert('Password must have at least one special character');
      } else if (error.code === ErrorCode.PASSWORD_MUST_HAVE_AT_LEAST_ONE_UPPERCASE_LETTER) {
        alert('Password must have at least one uppercase letter');
      } else if (error.code === ErrorCode.PASSWORD_TOO_SHORT) {
        alert('Password too short');
      } else {
        alert("An error has occurred")
      }
    }
    setLoading(false);
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
            text="signup_with"
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}/>
        </div>
        <button type="submit">{loading ? "Loading..." : "Sign Up"}</button>
        <button onClick={() => navigate('/login')}>Go to login</button>
      </form>
    </>
  )
    ;
};

export default Signup;
