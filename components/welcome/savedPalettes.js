import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditPalette from './editPalette';
import s from './styles.module.css'; 

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={s.trashIcon}>
    <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
  </svg>
);

const EditIcon = () => (
  <svg className="feather feather-edit" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SavedPalettes = () => {
  const [palettes, setPalettes] = useState([]);
  const [editingPaletteId, setEditingPaletteId] = useState(null); 

  useEffect(() => {
    fetchPalettes();
  }, []);

  const fetchPalettes = async () => {
    try {
      const response = await axios.get('/api/palettes');
      setPalettes(response.data);
    } catch (error) {
      console.error('Failed to fetch palettes:', error);
    }
  };

  const deletePalette = async (id) => {
    try {
      await axios.delete(`/api/palettes/${id}`);
      // Refresh the list after deletion
      fetchPalettes(); 
    } catch (error) {
      console.error('Failed to delete palette:', error);
    }
  };

  const handleEditClick = (paletteId) => {
    setEditingPaletteId(paletteId);
  };

  const exitEditMode = () => {
    setEditingPaletteId(null); 
  };

  if (editingPaletteId) {
    const paletteToEdit = palettes.find(palette => palette.id === editingPaletteId);
    if (!paletteToEdit) {
      console.error('Palette not found for editing');
      return null;
    }
    return (
      <EditPalette
        paletteToEdit={paletteToEdit}
        onUpdate={fetchPalettes}
        onCancel={exitEditMode}
      />
    );
  }


  return (
    <div className={s.welcomeContainer}>
      <h1 className={s.welcome}>Saved Color Palettes</h1>
      {palettes.map((palette) => (
        <div key={palette.id} className={s.palette} tabIndex="0">
          <h2>{palette.name}</h2>
          <div className={s.paletteColors}>
            {palette.colors.map((color, index) => (
              <div key={index} className={s.colorBox}>
                <div className={s.colorSample} style={{ backgroundColor: color.hex }} title={color.colorName}></div>
                <img src={color.imageBare} alt={color.colorName} className={s.colorImage} />
              </div>
            ))}
          </div>
          <div className={s.buttonContainer}>
            <button onClick={() => deletePalette(palette.id)} className={s.deletePalette}>
              <TrashIcon />
            </button>
            <button onClick={() => handleEditClick(palette.id)} className={s.editButton}>
              <EditIcon />
            </button>
          </div>
        </div>
      ))}
    </div>

  );
};

export default SavedPalettes;