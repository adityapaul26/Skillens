import { useNavigate, Link } from "react-router";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <main>
        <div className="form-container">
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email"></label>
              <input type="email" name="email" id="email" placeholder="Email" />
            </div>

            <div className="input-group">
              <label htmlFor="password"></label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>

            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account ? <Link to="/register">Register</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;
