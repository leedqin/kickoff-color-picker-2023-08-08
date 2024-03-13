import { useState, useEffect } from "react";
import axios from "axios";

//import s from "./styles.module.css";
import ColorPicker from "./colorPicker";
import ColorPalette from "./colorPalette";
import SavedPalettes from "./savedPalettes";
import SearchPalettes from "./searchPalettes";

// this is just an example
// feel free to use class based components and whatever paradigms you're most comfortable with
const Welcome = () => {

  return (
    <div>
      <ColorPicker />
      <ColorPalette />
      <SearchPalettes />
      <SavedPalettes />
    </div>

  
  );
};


export default Welcome;
