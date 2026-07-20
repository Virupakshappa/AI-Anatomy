// One entry per full-viewport section, ordered top (user) to bottom (earth).
// accent = hex color used for chips, kickers, glows. All stats are illustrative.
export const LAYERS = [
  {
    id: 'user',
    index: 0,
    name: 'User',
    kicker: 'Surface',
    title: 'The Chat Box',
    accent: '#22d3ee',
    tagline:
      'Everything begins here: a human, a text field, and a question typed into the void.',
    stats: ['~4 chars ≈ 1 token', 'TTFT target < 500 ms', 'Streamed via SSE'],
  },
  {
    id: 'edge',
    index: 1,
    name: 'Edge',
    kicker: 'Network Edge',
    title: 'API & Edge',
    accent: '#38bdf8',
    tagline:
      'Your prompt becomes an encrypted request hopping through CDN edges, load balancers, gateways and rate limiters.',
    stats: ['TLS 1.3 handshake', '300+ edge PoPs', 'HTTP 429 = back off'],
  },
  {
    id: 'serving',
    index: 2,
    name: 'Serving',
    kicker: 'Orchestration',
    title: 'Inference Serving',
    accent: '#818cf8',
    tagline:
      'Schedulers, routers and batchers pack thousands of conversations onto a fleet of GPUs.',
    stats: ['Continuous batching', 'KV-cache: GBs / session', '~50–100 tok/s out'],
  },
  {
    id: 'model',
    index: 3,
    name: 'Model',
    kicker: 'Neural Network',
    title: 'The Model',
    accent: '#a78bfa',
    tagline:
      'A transformer turns tokens into geometry: attention, matrix math, and one next-token guess at a time.',
    stats: ['10¹¹+ parameters', '~100 layers deep', 'Billions of FLOPs / token'],
  },
  {
    id: 'training',
    index: 4,
    name: 'Training',
    kicker: 'Learning',
    title: 'The Training Run',
    accent: '#c084fc',
    tagline:
      'Before it can answer, the model spends months on thousands of GPUs compressing the internet into weights.',
    stats: ['~10²⁵ FLOPs / run', 'Trillions of tokens', 'All-reduce every step'],
  },
  {
    id: 'datacenter',
    index: 5,
    name: 'Datacenter',
    kicker: 'Facility',
    title: 'The Data Center',
    accent: '#2dd4bf',
    tagline:
      'A building-sized machine: racks, spine-leaf fabric, liquid cooling loops and screaming airflow.',
    stats: ['PUE ≈ 1.1–1.4', '400–800G optics', 'Cold aisle: 18–27 °C'],
  },
  {
    id: 'server',
    index: 6,
    name: 'Server',
    kicker: 'Hardware',
    title: 'Compute Hardware',
    accent: '#fbbf24',
    tagline:
      'Inside one node: eight accelerators, terabytes per second of bandwidth, and kilowatts of appetite.',
    stats: ['~700 W per GPU', 'NVLink: 900 GB/s', 'HBM3e: ~4.8 TB/s'],
  },
  {
    id: 'chip',
    index: 7,
    name: 'Chip',
    kicker: 'Silicon',
    title: 'The Die',
    accent: '#f59e0b',
    tagline:
      'Zoom past the heat spreader: tens of billions of transistors and HBM towers stitched onto one interposer.',
    stats: ['80B+ transistors', '4 nm-class process', 'CoWoS packaging'],
  },
  {
    id: 'fab',
    index: 8,
    name: 'Fab',
    kicker: 'Fabrication',
    title: 'The Fab',
    accent: '#a78bfa',
    tagline:
      'In the cleanest rooms on Earth, plasma-born 13.5 nm light prints circuits smaller than viruses.',
    stats: ['EUV: 13.5 nm light', '50,000 tin droplets/s', '1 wafer ≈ 60–90 dies'],
  },
  {
    id: 'materials',
    index: 9,
    name: 'Materials',
    kicker: 'Supply Chain',
    title: 'Materials & Supply',
    accent: '#34d399',
    tagline:
      'A planetary supply chain: quartz, neon, helium, copper, cobalt and ultrapure water converge on one wafer.',
    stats: ['Si: 99.9999999% pure', '300 mm ingots', 'Megaliters of UPW / day'],
  },
  {
    id: 'energy',
    index: 10,
    name: 'Energy',
    kicker: 'Power',
    title: 'The Energy',
    accent: '#facc15',
    tagline:
      'Reactors, turbines and panels push rivers of electrons through substations, UPS and busbars into the racks.',
    stats: ['~100 MW campus', 'PUE 1.1 target', '34.5 kV → 415 V'],
  },
  {
    id: 'earth',
    index: 11,
    name: 'Earth',
    kicker: 'Foundation',
    title: 'Back to Sand',
    accent: '#fb923c',
    tagline:
      'Zoom all the way out: the whole stack, from a grain of quartz to the answer glowing on your screen.',
    stats: ['SiO₂ → 9N silicon', 'Sand → token: ~2 years', 'Loop complete'],
  },
]

export default LAYERS
