import React, { useEffect, useRef, useState } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import './navbar.style.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithToken, logout } from '../../features/user/userSlice';
import HamburgerIcon from '../../assets/icons/HamburgerIcon';
import ExitIcon from '../../assets/icons/ExitIcon';
import { categoryList } from '../../utils/categoryList';
import Modal from '../../composition/Modal';
import SearchIcon from '../../assets/icons/SearchIcon';
import { getSearchArticle } from '../../features/article/articleSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [query] = useSearchParams();
  let category = query.get('category') || 'business';
  if (!categoryList.includes(category)) category = 'business';

  const [isMenuOn, setIsMenuOn] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef(null);
  const [isLogoutModalOn, setIsLogoutModalOn] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { selectedArticle } = useSelector((store) => store.article);

  useEffect(() => {
    // 세션스토리지에 토큰이 있을 때만 실행
    const token = sessionStorage.getItem('token');
    if (token) {
      dispatch(loginWithToken());
    }
  }, [dispatch]);

  useEffect(() => {
    // 유저가 hamburger 메뉴를 킨 상태에서 윈도우 창을 resize 했을때 발생
    function resizeHandler() {
      if (selectedArticle || (isMenuOn && window.innerWidth <= 1125)) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        setIsMenuOn(false);
      }
    }

    // 초기 이벤트 불러오기
    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    // 이벤트 지우기 -> 웹성능
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isMenuOn, selectedArticle]);

  function getMenuTrigger() {
    setIsMenuOn((prev) => !prev);
  }

  function handleLogout() {
    dispatch(logout({ navigate }));
    handleLogoutConfirm();
  }

  function handleLogoutConfirm() {
    setIsLogoutModalOn((prev) => !prev);
  }

  function handleLogin() {
    navigate('/login');
  }

  // Search Feature
  function handleSearch() {
    setSearchValue('');
    setIsSearching((prev) => !prev);
  }
  function handleSearchKeyDown(e) {
    if (e.code === 'Enter') {
      submitSearch();
    }
  }
  function submitSearch() {
    if (searchValue === '') {
      handleSearch();
      return;
    }
    dispatch(
      getSearchArticle({
        category: category,
        searchTitle: searchValue,
      })
    );
    handleSearch();
  }

  useEffect(() => {
    if (isSearching) {
      searchRef.current.focus();
    }
  }, [isSearching]);

  return (
    <>
      <header className="navbar">
        <div className="navbar__menu" onClick={getMenuTrigger}>
          <HamburgerIcon />
        </div>
        <NavLink
          to="/"
          className="navbar__logo"
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="image-container">
            <img src="/assets/images/lowdown-logo.png" alt="logo-image" />
          </div>
        </NavLink>

        <nav>
          <div className="navbar__content">
            <button className="navbar__search" onClick={handleSearch}>
              <SearchIcon />
            </button>
            {user ? (
              <>
                <button className="navbar__btn" onClick={handleLogoutConfirm}>
                  Log Out
                </button>
                {location.pathname !== '/myfavorite' ? (
                  <Link className="navbar__favorite" to="/myfavorite">
                    My Page
                  </Link>
                ) : (
                  <Link className="navbar__favorite" to="/">
                    Home
                  </Link>
                )}
              </>
            ) : (
              <>
                <button className="navbar__btn" onClick={handleLogin}>
                  Log In
                </button>
                <Link className="navbar__register" to="/register">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>

        <>
          <section
            className={`navbar__aside ${isMenuOn && 'navbar__aside--active'}`}
          >
            <div className="navbar__aside-content">
              <h3>Category</h3>
              <div className="line"></div>
              <ul>
                {categoryList.map((item) => (
                  <li key={item} onClick={getMenuTrigger}>
                    <Link
                      className={`navbar__aside-link ${
                        category === item && 'navbar__aside-link--active'
                      }`}
                      to={`/?category=${item}`}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="navbar__aside-close" onClick={getMenuTrigger}>
                <ExitIcon />
              </div>
            </div>
          </section>
          {isMenuOn && (
            <div className="navbar__aside-bg" onClick={getMenuTrigger}></div>
          )}
          {isLogoutModalOn && (
            <Modal setModalOn={setIsLogoutModalOn}>
              <div className="modal__title">
                Are you sure you want to <span>log out</span>?
              </div>
              <div className="modal__btn-box">
                <button
                  className="modal__btn modal__btn--warn"
                  onClick={handleLogout}
                >
                  Log out
                </button>
                <button className="modal__btn" onClick={handleLogoutConfirm}>
                  Cancel
                </button>
              </div>
            </Modal>
          )}
        </>
      </header>
      {isSearching && (
        <div className="search">
          <div className="search__content" onKeyDown={handleSearchKeyDown}>
            <label>
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search title..."
                autoComplete="off"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </label>
            <button onClick={submitSearch}>Search</button>
          </div>
          <div className="search__back" onClick={handleSearch}></div>
        </div>
      )}
    </>
  );
};

export default Navbar;
