import s from "./styles.module.css";
import { useState, useEffect } from "react";
import axios from "axios";


const ColorPalette = () => {
    const [paletteRGBValues, setPaletteRGBValues] = useState(Array(5).fill('')); // Holds RGB values for 5 colors
    const [paletteColors, setPaletteColors] = useState([]); 
    const [paletteName, setPaletteName] = useState('');

    const fetchColor = async (rgbValue, index) => {
        if (!rgbValue) return null;
    
        try {
          const response = await axios.get(`https://www.thecolorapi.com/id`, {
            params: {
              rgb: rgbValue,
              format: 'json'
            }
          });
    
          return response.data;
        } catch (e) {
          console.error('Error fetching color data:', e);
          return null;
        }
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        // Fetch color information for all entered RGB values
        const colors = await Promise.all(
          paletteRGBValues.map((rgbValue, index) => 
            rgbValue ? fetchColor(rgbValue, index) : Promise.resolve(null))
        );
        // Filter out nulls in case of any fetch errors or empty inputs
        setPaletteColors(colors.filter(color => color !== null));
      };

    

      
  const updateRGBValue = (index, value) => {
    const newRGBValues = [...paletteRGBValues];
    newRGBValues[index] = value;
    setPaletteRGBValues(newRGBValues);
  };

  const savePalette = async () => {
    try {
      const paletteData = {
        name: paletteName,
        colors: paletteColors.map(color => ({
          hex: color.hex.value,
          colorName: color.name.value,
          imageBare: color.image.bare,
          imageNamed: color.image.named
        })).filter(color => color.hex !== '')
      };
  
      // Debug log to verify the data structure before sending
      console.log("paletteData", paletteData);
  
      // Send the palette data to the server
      await axios.post('/api/palettes', paletteData);
      alert('Palette saved successfully!');

      
    } catch (error) {
        console.error('Error saving palette:', error);
        alert('Failed to save the palette.'); 
    }
};


  return (
    <div className={s.welcomeContainer}>
      <h1 className={s.welcome}>Create A Color Palette</h1>
      <form onSubmit={handleSubmit} className={s.form}>
                <input
                    className={s.input}
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                    placeholder="Palette Name"
                />
                {paletteRGBValues.map((value, index) => (
                    <input
                        key={index}
                        className={s.input}
                        value={value}
                        onChange={(e) => updateRGBValue(index, e.target.value)}
                        placeholder={`Color ${index + 1} RGB value`}
                    />
                ))}
                <button className={s.button} type="button" onClick={handleSubmit}>
                    Fetch Colors
                </button>
                <button className={s.button} type="button" onClick={savePalette} disabled={!paletteName || paletteRGBValues.every(color => color === '')}>
                    Save Palette
                </button>
            </form>
      <div className={s.paletteContainer}>
        {paletteColors.map((color, index) => (
          <div key={index} className={s.paletteColor} style={{ backgroundColor: color.hex.value }}>
            <p>{color.name.value}</p>
            <img src={color.image.bare} alt="Color representation" className={s.colorImage} />
          </div>
        ))}
      </div>
    </div>
  );
};




export default ColorPalette;