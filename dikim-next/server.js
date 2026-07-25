# Passenger / Node entry — serves dist + API
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
await import('./server/index.js');
