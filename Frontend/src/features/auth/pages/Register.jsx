import { useNavigate, Link } from "react-router";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <main>
        <div className="form-container">
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username"></label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
              />
            </div>

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
            Already have an account ? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Register;
