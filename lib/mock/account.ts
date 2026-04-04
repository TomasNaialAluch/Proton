export const mockAccount = {
  // General
  username:       "artistusername",
  password:       "••••••••",
  fullName:       "Artist Full Name",

  // Contact
  email:          "artist@email.com",
  paypalEmail:    null, // disabled — system upgrading
  proEmail:       "artist@email.com",
  phone:          null,
  mailingAddress: "Buenos Aires",
  country:        "Argentina",

  // Payment
  paymentMethod:  "Crypto",
  paymentToken:   "USDC",
  walletAddress:  "0xdB815e2fDcb2f2...",
  paymentIsAuto:  false, // Crypto is manual, PayPal is auto

  // Connections — streaming
  connections: [
    { platform: "Spotify",    username: "Artist",  connected: true,  color: "#1DB954", canAddMore: false },
    { platform: "SoundCloud", username: "Artist",  connected: true,  color: "#FF5500", canAddMore: true  },
  ],

  // Connections — cloud storage
  cloudStorage: [
    { service: "Google Drive", connected: false },
    { service: "Dropbox",      connected: false },
  ],

  // Downloads
  autoDownload:   false,
  downloadFormat: "AIFF",
  downloadLocation: "Direct Download",

  // Notifications
  notifications: {
    newsletter:             true,
    promoPoolEmail:         "artist@email.com",
    labelInvites:           false,
    newPromos:              false,
    discoveryModeInvites:   true,
    discoveryModeReport:    true,
    releaseLinksNotify:     true,
    releaseLinksEmail:      "artist@email.com",
  },

  // Discovery Mode
  discoveryMode: {
    optedIn: true,
  },
};
