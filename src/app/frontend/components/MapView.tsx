'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { allPOIs } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

interface MapViewProps {
  onPOISelect?: (poiId: string) => void;
  selectedPOI?: string | null;
  activeDestination?: string;
}

const categoryColors: Record<string, string> = {
  attraction: '#f59e0b',
  activity: '#3b82f6',
  restaurant: '#ef4444',
  hotel: '#8b5cf6',
  location: '#10b981',
};

function createIcon(color: string, isActive: boolean) {
  const size = isActive ? 18 : 12;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 ${isActive ? '3px ' + color : '0px transparent'};
      transition: all 0.2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToBounds({ selectedPOI }: { selectedPOI?: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedPOI) return;
    const poi = allPOIs.find((p) => p.poiId === selectedPOI);
    if (poi) {
      map.flyTo([poi.lat, poi.lng], 10, { duration: 1.5 });
    }
  }, [selectedPOI, map]);
  return null;
}

export default function MapView({ onPOISelect, selectedPOI, activeDestination }: MapViewProps) {
  const center: [number, number] = activeDestination === 'goa'
    ? [15.5, 73.9]
    : activeDestination === 'kerala'
    ? [9.8, 76.4]
    : [26.8, 74.5];

  const filteredPOIs = activeDestination && activeDestination !== 'all'
    ? allPOIs.filter((p) => {
        if (activeDestination === 'rajasthan') return ['Jaipur', 'Udaipur', 'Jaisalmer'].includes(p.city);
        if (activeDestination === 'goa') return ['Goa', 'Old Goa', 'Ponda', 'South Goa'].includes(p.city);
        if (activeDestination === 'kerala') return ['Alleppey', 'Munnar', 'Thekkady', 'Thiruvananthapuram', 'Wayanad', 'Kochi', 'Kerala'].includes(p.city);
        return true;
      })
    : allPOIs;

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ width: '100%', height: '100%', minHeight: 500 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToBounds selectedPOI={selectedPOI} />
      {filteredPOIs.map((poi) => (
        <Marker
          key={poi.poiId}
          position={[poi.lat, poi.lng]}
          icon={createIcon(categoryColors[poi.category] || '#3b82f6', selectedPOI === poi.poiId)}
          eventHandlers={{
            click: () => {
              onPOISelect?.(poi.poiId);
            },
          }}
        >
          <Popup>
            <div className="p-1 min-w-[180px]">
              <p className="font-bold text-sm mb-1">{poi.name}</p>
              <p className="text-xs text-gray-500 mb-1">{poi.city}</p>
              <p className="text-xs mb-1">{poi.description.slice(0, 100)}...</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-green-600">{formatCurrency(poi.cost)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-amber-500">{'★'.repeat(Math.round(poi.rating))}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {poi.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
