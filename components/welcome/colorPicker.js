import s from "./styles.module.css";
import { useState, useEffect } from "react";
import axios from "axios";


const ColorPicker = () => {
  const [color, setColor] = useState(null);
  const [rgbValue, setRGBValue] = useState('');


  // Using The Color API to fetch color information and image
  const fetchColor = async () => {
    if (!rgbValue) return;

    try {
      const response = await axios.get(`https://www.thecolorapi.com/id`, {
        params: {
          rgb: rgbValue,
          format: 'json'
        }
      });

      setColor(response.data);
    } catch (e) {
      console.error('Error fetching color data:', e);
      setColor(null);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColor();
  };


  return (
    <div className={s.welcomeContainer}>
      <h1 className={s.welcome}>Pick A Color</h1>
      <div className={s.form}>
        <input
          className={s.input}
          value={rgbValue}
          onChange={(e) => setRGBValue(e.target.value)}
          placeholder="Enter RGB value"
        />
        <button className={s.button} onClick={handleSubmit} disabled={!rgbValue}>
          Submit
        </button>
      </div>
      {color && (
        <div>
          <h2>Color Information: {color.name.value}</h2>
          <div style={{
            backgroundColor: color.hex.value,
            color: color.contrast.value,
            padding: '10px',
            marginTop: '10px'
          }}>
            Hex: {color.hex.value} <br />
            RGB: {color.rgb.value} <br />
            HSL: {color.hsl.value}
          </div>
          <div style={{ marginTop: '20px' }}>
            <img src={color.image.bare} alt="Color representation" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>
      )}
    </div>
  );

}

export default ColorPicker;