import knex from "../../../clients/knex";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const palettes = await knex('palettes').select('*');
      const processedPalettes = palettes.map(palette => ({
        ...palette,
        colors: palette.colors ? JSON.parse(palette.colors) : [],
      }));
      res.status(200).json(processedPalettes);
    } catch (error) {
      console.error('Error fetching palettes:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { name, colors } = req.body;
    if (typeof name !== 'string' || !Array.isArray(colors)) {
      return res.status(400).json({ error: "Invalid input format for 'name' or 'colors'." });
    }
    try {
      const newPalette = await knex('palettes')
        .insert({
          name,
          colors: JSON.stringify(colors),
        }, ['id', 'name', 'colors'])
        .then(rows => rows[0]);
      if (newPalette.colors) {
        newPalette.colors = JSON.parse(newPalette.colors);
      }
      res.status(201).json(newPalette);
    } catch (error) {
      console.error('Error creating new palette:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}