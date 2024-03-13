import knex from "../../../clients/knex";


export default async function handler(req, res) {
  const { id } = req.query;
   if (req.method === 'PUT') {
    try {
      const { name, colors } = req.body;
      if (!name || !Array.isArray(colors)) {
        return res.status(400).json({ message: 'Invalid request body' });
      }

      // Convert the colors array to a JSON string for storage
      const colorsJson = JSON.stringify(colors);

      // Update the palette
      const updatedRows = await knex('palettes')
        .where({ id })
        .update({ name, colors: colorsJson });

      if (updatedRows) {
        const updatedPalette = await knex('palettes').where({ id }).first();
        updatedPalette.colors = JSON.parse(updatedPalette.colors || '[]');
        res.status(200).json(updatedPalette);
      } else {
        res.status(404).json({ message: 'Palette not found' });
      }
    } catch (error) {
      console.error('Error updating palette:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await knex('palettes').where({ id }).del();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting palette:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
