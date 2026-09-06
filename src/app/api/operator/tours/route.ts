import { NextResponse } from 'next/server';

const mockTours = [
  { id: 'T-1024', customer: 'Sarah & Mike', destination: 'Rajasthan', dates: 'Sep 12-18', status: 'active', margin: 22000, coordinator: 'Priya', nextAction: 'Amber Fort transfer' },
  { id: 'T-1025', customer: 'Chen Family', destination: 'Rajasthan', dates: 'Sep 13-19', status: 'active', margin: 18500, coordinator: 'Arjun', nextAction: 'Desert safari pickup' },
  { id: 'T-1026', customer: 'Anjali R.', destination: 'Kerala', dates: 'Sep 14-20', status: 'planning', margin: 31000, coordinator: null, nextAction: 'Awaiting payment' },
  { id: 'T-1027', customer: 'David & Co.', destination: 'Goa', dates: 'Sep 15-22', status: 'active', margin: 15800, coordinator: 'Meera', nextAction: 'Beach house check-in' },
  { id: 'T-1028', customer: 'Priya Family', destination: 'Udaipur', dates: 'Sep 16-18', status: 'arriving', margin: 7300, coordinator: 'Priya', nextAction: 'Arrival pickup 14:00' },
  { id: 'T-1029', customer: 'Kate Winslow', destination: 'Jaisalmer', dates: 'Sep 18-22', status: 'planning', margin: 26400, coordinator: null, nextAction: 'Finalize itinerary' },
  { id: 'T-1030', customer: 'Venkat & Shruti', destination: 'Rajasthan', dates: 'Sep 12-19', status: 'completed', margin: 19400, coordinator: 'Arjun', nextAction: 'Awaiting review' },
  { id: 'T-1031', customer: 'Emma Group (6)', destination: 'Jaipur', dates: 'Sep 17-20', status: 'active', margin: 41000, coordinator: 'Meera', nextAction: 'City Palace verify' },
];

export async function GET() {
  return NextResponse.json({
    totalTours: mockTours.length,
    activeTours: mockTours.filter(t => t.status === 'active').length,
    totalMargin: mockTours.reduce((s, t) => s + t.margin, 0),
    tours: mockTours,
  });
}