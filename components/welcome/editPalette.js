import React, { useState, useEffect } from "react";
import axios from "axios";
import s from "./styles.module.css"; 

const EditPalette = ({ paletteToEdit, onUpdate , onCancel}) => {
    const [paletteName, setPaletteName] = useState(paletteToEdit.name);
    const [paletteRGBValues, setPaletteRGBValues] = useState(paletteToEdit.colors.map(color => color.rgbValue || ''));
    const [paletteColors, setPaletteColors] = useState([]);

    useEffect(() => {
        const initialColors = paletteToEdit.colors.map(color => ({
            hex: { value: color.hex },
            name: { value: color.colorName },
            image: { bare: color.imageBare, named: color.imageNamed }
        }));
        setPaletteColors(initialColors);
    }, [paletteToEdit.colors]);


    const fetchColor = async (rgbValue) => {
        if (!rgbValue) return;

        try {
            const response = await axios.get(`https://www.thecolorapi.com/id`, {
                params: { rgb: rgbValue, format: "json" }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching color data:", error);
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const colors = await Promise.all(
            paletteRGBValues.map((rgbValue) =>
                rgbValue ? fetchColor(rgbValue) : Promise.resolve(null)
            )
        );
        setPaletteColors(colors.filter(color => color !== null));
    };

    const updatePalette = async () => {
        try {
            const updatedPaletteData = {
                id: paletteToEdit.id,
                name: paletteName,
                colors: paletteColors.map(color => ({
                    hex: color.hex.value,
                    colorName: color.name.value,
                    imageBare: color.image.bare,
                    imageNamed: color.image.named,
                    rgbValue: color.rgb.value 
                }))
            };

            await axios.put(`/api/palettes/${paletteToEdit.id}`, updatedPaletteData);
            onUpdate(); 
            onCancel(); // Exit out of edit mode 
            alert("Palette updated successfully!");
        } catch (error) {
            console.error("Error updating palette:", error);
            alert("Failed to update the palette.");
        }
    };

    return (
        <div className={s.welcomeContainer}>
            <h1 className={s.welcome}>Edit Palette</h1>
            <form className={s.form} onSubmit={handleSubmit}>
                <input
                    className={s.input}
                    value={paletteName}
                    onChange={e => setPaletteName(e.target.value)}
                    placeholder="Palette Name"
                />
                {paletteRGBValues.map((value, index) => (
                    <input
                        key={index}
                        className={s.input}
                        value={value}
                        onChange={e => {
                            const newValues = [...paletteRGBValues];
                            newValues[index] = e.target.value;
                            setPaletteRGBValues(newValues);
                        }}
                        placeholder={`Color ${index + 1} RGB value`}
                    />
                ))}
                <button className={s.button} type="button" onClick={handleSubmit}>
                    Fetch New Colors
                </button>
                <button className={s.button} type="button" onClick={updatePalette}>
                    Update Palette
                </button>
                <button className={s.button} type="button" onClick={onCancel}>
                    Cancel
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
}


export default EditPalette;