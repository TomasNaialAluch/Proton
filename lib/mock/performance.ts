// Mock stream/sales data per track ID
// Real stream data is not available in the public Proton API
export const TRACK_STREAMS: Record<string, number> = {
  "649270": 3,   // Sides
  "649271": 14,  // Breach
  "649272": 23,  // Living
  "786901": 8,   // Empire
  "786902": 6,   // Fundation
  "786903": 5,   // Trantor
  "940676": 10,  // Dmt
  "940677": 16,  // Does This to My Mind
  "1095325": 9,  // Back
  "1095326": 9,  // Back (alt)
  "1130181": 19, // Tied Inside
  "1130182": 29, // Emotional Damage
};

export const TRACK_SALES: Record<string, number> = {
  "1130182": 1,  // Emotional Damage — only sale
};

// Genre per track ID (not in public API)
export const TRACK_GENRES: Record<string, string> = {
  "649270": "Melodic House",
  "649271": "Melodic House",
  "649272": "Melodic House",
  "786901": "Progressive",
  "786902": "Progressive",
  "786903": "Progressive",
  "940676": "Progressive",
  "940677": "Progressive",
  "1095325": "Melodic House",
  "1095326": "Melodic House",
  "1130181": "Progressive",
  "1130182": "Progressive",
};
