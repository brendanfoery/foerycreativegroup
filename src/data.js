export const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const monthlyRevenue  = [28500,31200,42800,38600,45200,52100,48900,41300,55700,49800,38400,62500];
export const monthlyExpenses = [22000,18500,28000,25000,31500,35000,29000,27500,38000,32000,26000,45000];

export const totalRevenue  = monthlyRevenue.reduce((a,b)=>a+b,0);   // 535,000
export const totalExpenses = monthlyExpenses.reduce((a,b)=>a+b,0);  // 357,500
export const netProfit     = totalRevenue - totalExpenses;           // 177,500
export const profitMargin  = ((netProfit / totalRevenue) * 100).toFixed(1); // 33.2

export const revenueBySource = {
  'Streaming':      240750,
  'Sync Licensing': 133750,
  'Merchandise':    107000,
  'Live Events':     53500,
};

export const expensesByCategory = {
  'Studio & Recording': 107250,
  'Marketing & Promo':   89375,
  'Artist Advances':    107250,
  'Distribution Fees':   53625,
};

export const artists = [
  {
    name: "Solomon's Temple",
    genre: 'R&B / Gospel',
    avatar: 'ST',
    color: 'amber',
    revenue: 178000,
    expenses: 89000,
    profit: 89000,
    streams: 4200000,
    projects: ["Lifted Up (Album)", "Higher Ground (EP)"],
  },
  {
    name: 'Zion Worship Collective',
    genre: 'Worship',
    avatar: 'ZW',
    color: 'blue',
    revenue: 124000,
    expenses: 71000,
    profit: 53000,
    streams: 2800000,
    projects: ["Living Water (Album)", "Sunday Sessions (Single)"],
  },
  {
    name: 'Grace Notes',
    genre: 'Contemporary Christian',
    avatar: 'GN',
    color: 'green',
    revenue: 98000,
    expenses: 64000,
    profit: 34000,
    streams: 1900000,
    projects: ["By Grace (EP)", "Unshaken (Single)"],
  },
  {
    name: 'Harvest Sound',
    genre: 'Gospel Hip-Hop',
    avatar: 'HS',
    color: 'purple',
    revenue: 87000,
    expenses: 79000,
    profit: 8000,
    streams: 1600000,
    projects: ["Fields of Gold (Mixtape)"],
  },
  {
    name: 'Kingdom Voices',
    genre: 'Gospel Choir',
    avatar: 'KV',
    color: 'rose',
    revenue: 48000,
    expenses: 54500,
    profit: -6500,
    streams: 950000,
    projects: ["Anthem (Album)"],
  },
];

export const revenueTransactions = [
  { id:1,  date:'2025-12-18', source:'Streaming',      artist:"Solomon's Temple",        description:'Spotify Q4 Royalties',                  amount: 9420  },
  { id:2,  date:'2025-12-12', source:'Sync Licensing', artist:'Zion Worship Collective',  description:'Netflix Documentary License',           amount:15000  },
  { id:3,  date:'2025-12-08', source:'Merchandise',    artist:"Solomon's Temple",        description:'Holiday Merch Bundle Sales',             amount: 6800  },
  { id:4,  date:'2025-12-01', source:'Live Events',    artist:'Grace Notes',              description:'Praise Fest 2025 — Atlanta',             amount:12500  },
  { id:5,  date:'2025-11-28', source:'Streaming',      artist:'Harvest Sound',            description:'Apple Music November Royalties',        amount: 4200  },
  { id:6,  date:'2025-11-20', source:'Sync Licensing', artist:"Solomon's Temple",        description:'Tyler Perry Film Placement',             amount:22000  },
  { id:7,  date:'2025-11-15', source:'Merchandise',    artist:'Zion Worship Collective',  description:'Online Store Sales — November',         amount: 3100  },
  { id:8,  date:'2025-11-05', source:'Streaming',      artist:'Kingdom Voices',           description:'Spotify November Royalties',            amount: 2800  },
  { id:9,  date:'2025-10-30', source:'Live Events',    artist:'Kingdom Voices',           description:'Church Conference — Houston',           amount: 8000  },
  { id:10, date:'2025-10-22', source:'Streaming',      artist:'Grace Notes',              description:'YouTube Music Q3 Royalties',            amount: 5600  },
  { id:11, date:'2025-10-15', source:'Sync Licensing', artist:'Harvest Sound',            description:'Nike Ad Campaign License',              amount:18500  },
  { id:12, date:'2025-10-08', source:'Merchandise',    artist:"Solomon's Temple",        description:'Tour Merch — Southeast Tour',            amount:11200  },
  { id:13, date:'2025-09-25', source:'Live Events',    artist:"Solomon's Temple",        description:'Gospel Music Awards Showcase',          amount:15000  },
  { id:14, date:'2025-09-18', source:'Streaming',      artist:'Zion Worship Collective',  description:'Tidal Q3 Royalties',                   amount: 3800  },
  { id:15, date:'2025-09-10', source:'Sync Licensing', artist:'Grace Notes',              description:'Hallmark Channel License',              amount: 9500  },
];

export const expenseTransactions = [
  { id:1,  date:'2025-12-14', category:'Studio & Recording', artist:"Solomon's Temple",       description:'Electric Lady Studios — 2 Weeks',       amount:14000 },
  { id:2,  date:'2025-12-10', category:'Marketing & Promo',  artist:'Zion Worship Collective', description:'Instagram / Facebook Ad Campaign',      amount: 5500 },
  { id:3,  date:'2025-12-05', category:'Artist Advances',    artist:'Kingdom Voices',          description:'Album Recording Advance',               amount:20000 },
  { id:4,  date:'2025-11-28', category:'Distribution Fees',  artist:'All Artists',             description:'DistroKid Annual Plan + Streaming Fees',amount: 3200 },
  { id:5,  date:'2025-11-20', category:'Marketing & Promo',  artist:"Solomon's Temple",       description:'Pitchfork Sponsored Content',            amount: 8000 },
  { id:6,  date:'2025-11-12', category:'Studio & Recording', artist:'Harvest Sound',           description:'Mixing & Mastering — Fields of Gold',   amount: 6500 },
  { id:7,  date:'2025-11-05', category:'Artist Advances',    artist:'Grace Notes',             description:'Q4 Advance Payment',                    amount:12000 },
  { id:8,  date:'2025-10-28', category:'Marketing & Promo',  artist:'Harvest Sound',           description:'Music Video Production',                amount:15000 },
  { id:9,  date:'2025-10-20', category:'Studio & Recording', artist:'Zion Worship Collective', description:'Capitol Studios — Live Recording',      amount: 9800 },
  { id:10, date:'2025-10-12', category:'Distribution Fees',  artist:'All Artists',             description:'Sync Licensing Platform Fees',          amount: 2800 },
  { id:11, date:'2025-09-30', category:'Artist Advances',    artist:"Solomon's Temple",       description:'New Album Advance',                     amount:35000 },
  { id:12, date:'2025-09-22', category:'Marketing & Promo',  artist:'Kingdom Voices',          description:'PR Agency Monthly Retainer',            amount: 4500 },
  { id:13, date:'2025-09-15', category:'Studio & Recording', artist:'Grace Notes',             description:'Sound City Studios — EP Recording',     amount: 8200 },
  { id:14, date:'2025-09-08', category:'Distribution Fees',  artist:'All Artists',             description:'Physical Distribution — CDs & Vinyl',   amount: 4100 },
  { id:15, date:'2025-09-02', category:'Marketing & Promo',  artist:'Zion Worship Collective', description:'Billboard Magazine Placement',          amount: 6000 },
];
