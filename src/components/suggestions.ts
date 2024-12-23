// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { q } = req.query;

//   if (!q) {
//     return res.status(400).json({ error: 'Query parameter is required' });
//   }

//   try {
//     const response = await fetch(
//       `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q as string)}`
//     );
//     const data = await response.json();
    
//     // Enable CORS
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
    
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to fetch suggestions' });
//   }
// }