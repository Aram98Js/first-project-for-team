import { Router } from 'express';

// Example catalogue only: replace with a provider before offering live tickets.
export const destinations = [
  { id: 'flight-paris', transport: 'plane', from: 'Yerevan', to: 'Paris', departure: '08:30', arrival: '11:45', duration: '5h 15m', price: 240, currency: 'EUR', description: 'A city escape filled with art, cafés and unforgettable views.' },
  { id: 'flight-rome', transport: 'plane', from: 'Yerevan', to: 'Rome', departure: '10:00', arrival: '12:10', duration: '4h 10m', price: 195, currency: 'EUR', description: 'Ancient streets, Italian flavours and a slower pace of life.' },
  { id: 'train-lyon', transport: 'train', from: 'Paris', to: 'Lyon', departure: '09:00', arrival: '11:00', duration: '2h', price: 49, currency: 'EUR', description: 'Watch the countryside unfold on a relaxed city-to-city journey.' },
  { id: 'train-florence', transport: 'train', from: 'Rome', to: 'Florence', departure: '11:20', arrival: '12:55', duration: '1h 35m', price: 35, currency: 'EUR', description: 'Discover Renaissance treasures in the heart of Tuscany.' },
  { id: 'bus-tbilisi', transport: 'bus', from: 'Yerevan', to: 'Tbilisi', departure: '08:00', arrival: '14:00', duration: '6h', price: 30, currency: 'EUR', description: 'Mountain landscapes and a warm welcome in the old town.' },
  { id: 'bus-dilijan', transport: 'bus', from: 'Yerevan', to: 'Dilijan', departure: '09:30', arrival: '11:30', duration: '2h', price: 12, currency: 'EUR', description: 'Trade the city for forest trails and peaceful mountain air.' },
];

const destinationRouter = Router();
destinationRouter.get('/api/destinations', (_req, res) => {
  res.json({ destinations, demo: true });
});
export default destinationRouter;
