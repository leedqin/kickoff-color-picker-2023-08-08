import React, { useState } from 'react';
import axios from 'axios';
import s from './styles.module.css'; 

const SearchPalettes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(`/api/palettes/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search palettes:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className={s.welcomeContainer}>
      <h1 className={s.welcome}>Search Color Palettes</h1>
      <form onSubmit={handleSearch} className={s.form}>
        <input
          type="text"
          className={s.input}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search palettes by name"
        />
        <button className={s.button} type="submit">Search</button>
      </form>
      <div className={s.searchResults}>
        {searchResults.length > 0 ? searchResults.map((palette) => (
          <div key={palette.id} className={s.palette}>
            <h2>{palette.name}</h2>
            <div className={s.paletteColors}>
              {palette.colors.map((color, index) => (
                <div key={index} className={s.colorBox}>
                  <div
                    className={s.colorSample}
                    style={{ backgroundColor: color.hex }}
                    title={color.colorName}
                  ></div>
                  {color.imageBare && (
                    <img src={color.imageBare} alt={color.colorName} className={s.colorImage} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )) : (
          <p>No palettes found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPalettes;
