import knex from "../../../clients/knex";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Missing query parameter" });
    }

    try {
      const searchResults = await knex('palettes')
        .where('name', 'like', `%${query}%`)
        .select('*');

      const processedResults = searchResults.map(palette => ({
        ...palette,
        colors: JSON.parse(palette.colors || '[]'), // assuming colors are stored as JSON strings
      }));

      res.status(200).json(processedResults);
    } catch (error) {
      console.error('Error searching palettes:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
