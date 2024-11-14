import React, { useEffect } from 'react';
import './login.style.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../../features/user/userSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 백엔드 로직이 준비가 되면 활성화
  const { user, loading, error } = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  function handleCancel() {
    navigate('/');
  }

  function submitHandle(e) {
    e.preventDefault();
    const [email, password] = e.target;
    const items = { email: email.value, password: password.value };

    // 로그인 로직이 준비가 되면 활성화
    dispatch(loginWithEmail(items));
  }

  return (
    <main className="login">
      <div className="login__content">
        <h1>Log-in</h1>
        <form className="login__form" onSubmit={submitHandle}>
          <label>
            Email{' '}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              autoComplete="off"
            />
          </label>
          <label>
            Password{' '}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="off"
            />
          </label>
          <div className="login__btn-box">
            <button className="login__btn-submit" type="submit">
              Login
            </button>
            <button
              className="login__btn-cancel"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
        {/* 백엔드 로직이 준비 되면 활성화 */}
        {error && (
          <div className="login__error">
            {error.message || error.toString()}
          </div>
        )}
        <Link to={'/register'} title="go to register page">
          Don't have an account? Create one here.
        </Link>
      </div>
      {/* google login here */}
    </main>
  );
};

export default LoginPage;
