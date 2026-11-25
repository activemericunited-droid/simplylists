export default function handler(req, res) {
  const country = (req.headers['x-vercel-ip-country'] || '').toUpperCase();
  const region = (req.headers['x-vercel-ip-country-region'] || '').toUpperCase();

  // Strictly California: ['CA']
  // California + bordering states ("near California"): ['CA', 'NV', 'AZ', 'OR']
  const ALLOWED_REGIONS = ['CA', 'NV', 'AZ', 'OR'];

  const allowed = country === 'US' && ALLOWED_REGIONS.includes(region);

  res.status(200).json({
    allowed,
    country,
    region
  });
}
