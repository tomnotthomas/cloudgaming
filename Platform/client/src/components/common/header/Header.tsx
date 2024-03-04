import './Header.css';
import React from 'react';
import Cookies from "universal-cookie";
import { SlArrowLeft } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { HiOutlineLogout } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { FaSteam } from "react-icons/fa";


const cookies = new Cookies();

const Header = ({loggedSteam, searchQuery, setSearchQuery, searching, setSearching, setSearchResults}) => {
  const navigate = useNavigate();

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    cookies.remove("USER_DATA", { path: "/" });
    navigate("/login");
  }

  const searchRAWGGames = async (query) => {
    try {
      const apiUrl = `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${query}&platforms=4&stores=1`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`${query} not found`);
      }
      const data = await response.json();
      console.log(`${query} loaded:`, { data });
      setSearchResults(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleSearch = () => {
    if (searchQuery.length > 2) {
      searchRAWGGames(searchQuery);
      setSearching(true);
    }
  };

  const handleReset = () => {
    setSearching(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="header-container">
      <div className="header-button-container">
        <div className="container-header">
          <div>
            {loggedSteam ? (
              <div></div>
            ) : (
              <button className="steam-button-1"><FaSteam />
							Connect to Steam</button>
            )}
          </div>
					<div className="header-button-container">
					<div className="search-container">
        {searching ? (
          <button className="back-home-button" onClick={handleReset}>
            <SlArrowLeft />
          </button>
        ) : null}
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for games..."
        />
        {/* Removed the original search button */}
      </div>
          {/* Updated btn3 to include search functionality */}
          <div className="btn btn--3" onClick={handleSearch}>
            <div className="content">
              <div className="front">
                <div className="border"></div>
                <IoSearchOutline className='header-icon' />
              </div>
              <div className="back">
                <div className="border"></div>
                <p>Search</p> {/* Updated text to reflect action */}
              </div>
            </div>
          </div>
        	<div className="btn btn--1">
        		<div className="content">
        			<div className="front">
        				<div className="border"></div>
                <CgProfile className='header-icon' />
        			</div>
        			<div className="back">
        				<div className="border"></div>
        				<p>Settings</p>
        			</div>
        		</div>
        	</div>
        	<div className="btn btn--2">
        		<div className="content">
        			<div className="front">
        				<div className="border"></div>
                <HiOutlineLogout className='header-icon' />
        			</div>
        			<div className="back">
        				<div className="border"></div>
        				<p onClick={logout}>Logout</p>
        			</div>
        		</div>
        	</div>
					</div>
        </div>

      </div>
    </div>
  );
};

export default Header;
