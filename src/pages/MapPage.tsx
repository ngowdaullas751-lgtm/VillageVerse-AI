import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  AlertCircle,
  Crosshair,
  Droplets,
  HeartPulse,
  Layers,
  Route,
  Sun,
  Waves,
} from 'lucide-react';
import {
  MapAsset,
  MapLayerType,
  VillageComplaint,
  VillageProfile,
} from '../types/village';

interface MapPageProps {
  village: VillageProfile;
  complaints: VillageComplaint[];
}

const LAYER_META: Record<
  MapLayerType,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  water: { label: 'Water Network', color: '#38BDF8', icon: Droplets },
  solar: { label: 'Solar & Grid', color: '#10B981', icon: Sun },
  roads: { label: 'Roads & Lights', color: '#A78BFA', icon: Route },
  healthcare: { label: 'Health & Schools', color: '#22D3EE', icon: HeartPulse },
  complaints: { label: 'Citizen Complaints', color: '#F59E0B', icon: AlertCircle },
  flood_zones: { label: 'Flood Risk Zones', color: '#F43F5E', icon: Waves },
};

type BasemapMode = 'dark' | 'osm';

function createMarkerIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 18 : 13;
  const ring = isSelected ? `0 0 0 5px ${color}44` : `0 0 0 3px #060D1A`;
  return L.divIcon({
    className: 'village-map-pin',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #F8FAFC;box-shadow:${ring};transition:transform 150ms ease;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -10],
  });
}

export const MapPage: React.FC<MapPageProps> = ({ village, complaints }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayGroupRef = useRef<L.LayerGroup | null>(null);
  const markersByIdRef = useRef<Record<string, L.Marker>>({});

  const [basemap, setBasemap] = useState<BasemapMode>('dark');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    village.mapAssets[0]?.id ?? null
  );
  const [activeLayers, setActiveLayers] = useState<Record<MapLayerType, boolean>>({
    water: true,
    solar: true,
    roads: true,
    healthcare: true,
    complaints: true,
    flood_zones: true,
  });

  // Merge village map assets with any live open complaints added in session
  const combinedAssets = useMemo<MapAsset[]>(() => {
    const baseNonComplaints = village.mapAssets.filter(
      (a) => a.layer !== 'complaints'
    );
    const liveComplaintAssets: MapAsset[] = complaints
      .filter((c) => c.status !== 'Resolved')
      .map((c) => ({
        id: `cmp-${c.id}`,
        name: `${c.category}: ${c.title}`,
        layer: 'complaints',
        ward: c.ward,
        lat: c.lat,
        lng: c.lng,
        status: c.priority === 'Critical' ? 'Critical' : 'Attention',
        metricLabel: 'Status / SLA',
        metricValue: `${c.status} · ${c.slaRemainingHours}h left`,
        details: c.description,
      }));
    return [...baseNonComplaints, ...liveComplaintAssets];
  }, [village.mapAssets, complaints]);

  const visibleAssets = useMemo(
    () => combinedAssets.filter((a) => activeLayers[a.layer]),
    [combinedAssets, activeLayers]
  );

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [village.centerLat, village.centerLng],
      zoom: 15,
      zoomControl: true,
      preferCanvas: true,
    });

    const group = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    overlayGroupRef.current = group;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      overlayGroupRef.current = null;
      markersByIdRef.current = {};
    };
  }, []);

  // Recenter when switching active village
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([village.centerLat, village.centerLng], 15, { animate: true });
    setSelectedAssetId(village.mapAssets[0]?.id ?? null);
  }, [village.id, village.centerLat, village.centerLng, village.mapAssets]);

  // Switch tile basemap cleanly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const url =
      basemap === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution =
      basemap === 'dark'
        ? '&copy; OpenStreetMap contributors &copy; CARTO'
        : '&copy; OpenStreetMap contributors';

    tileLayerRef.current = L.tileLayer(url, {
      maxZoom: 19,
      attribution,
    }).addTo(map);
  }, [basemap]);

  // Render markers and flood polygons whenever layers/selection/village change
  useEffect(() => {
    const group = overlayGroupRef.current;
    if (!group) return;

    group.clearLayers();
    markersByIdRef.current = {};

    // Flood risk polygons
    if (activeLayers.flood_zones) {
      village.floodZones.forEach((zone) => {
        const color = zone.risk === 'High' ? '#F43F5E' : '#F59E0B';
        const poly = L.polygon(zone.coordinates, {
          color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: zone.risk === 'High' ? 0.24 : 0.16,
          dashArray: '5 4',
        }).addTo(group);

        poly.bindPopup(
          `<div style="min-width:200px">
            <div style="font-size:11px;color:${color};font-weight:600;margin-bottom:2px;">${zone.risk} Flood Risk Zone</div>
            <div style="font-size:13px;font-weight:600;color:#F4F8FF;margin-bottom:6px;">${zone.name}</div>
            <div style="font-size:12px;color:#A5B8D4;">Exposed: <strong style="color:#F4F8FF">${zone.affectedHouseholds} households</strong></div>
          </div>`
        );
      });
    }

    // Asset & complaint markers
    visibleAssets.forEach((asset) => {
      const meta = LAYER_META[asset.layer];
      const isSelected = asset.id === selectedAssetId;
      const marker = L.marker([asset.lat, asset.lng], {
        icon: createMarkerIcon(meta.color, isSelected),
      }).addTo(group);

      marker.bindPopup(
        `<div style="min-width:220px">
          <div style="font-size:11px;color:${meta.color};font-weight:600;margin-bottom:2px;">${meta.label} · ${asset.ward}</div>
          <div style="font-size:13px;font-weight:600;color:#F4F8FF;margin-bottom:6px;">${asset.name}</div>
          <div style="font-size:12px;color:#C5D4E8;margin-bottom:6px;">${asset.details}</div>
          <div style="display:flex;justify-content:space-between;padding-top:6px;border-top:1px solid #1B2E4B;font-size:11px;">
            <span style="color:#8BA3C7;">${asset.metricLabel}</span>
            <span style="color:#22D3EE;font-family:monospace;font-weight:600;">${asset.metricValue}</span>
          </div>
        </div>`
      );

      marker.on('click', () => {
        setSelectedAssetId(asset.id);
      });

      markersByIdRef.current[asset.id] = marker;
    });
  }, [village.floodZones, visibleAssets, activeLayers.flood_zones, selectedAssetId]);

  const toggleLayer = (layer: MapLayerType) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleSelectAsset = (asset: MapAsset) => {
    setSelectedAssetId(asset.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([asset.lat, asset.lng], 16, { duration: 0.7 });
      window.setTimeout(() => {
        markersByIdRef.current[asset.id]?.openPopup();
      }, 300);
    }
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([village.centerLat, village.centerLng], 15, {
      duration: 0.6,
    });
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Left GIS Layer & Asset Inspector Sidebar */}
      <aside className="w-full lg:w-[340px] shrink-0 bg-[#091222] border-b lg:border-b-0 lg:border-r border-[#172844] flex flex-col max-h-[45vh] lg:max-h-[calc(100vh-4rem)]">
        <div className="p-4 border-b border-[#172844]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-base font-semibold text-[#F4F8FF]">
                Village GIS Map
              </h1>
              <p className="text-xs text-[#8BA3C7]">
                OpenStreetMap · {village.name}
              </p>
            </div>
            <button
              onClick={handleRecenter}
              className="p-2 rounded-lg bg-[#0F1E36] hover:bg-[#172D4F] border border-[#1E3354] text-cyan-400"
              title="Recenter map"
              aria-label="Recenter map"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

          {/* Basemap Switcher */}
          <div className="mt-3 flex items-center gap-1 p-1 bg-[#060D1A] border border-[#172844] rounded-lg">
            <button
              onClick={() => setBasemap('dark')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                basemap === 'dark'
                  ? 'bg-[#142645] text-[#F4F8FF]'
                  : 'text-[#8BA3C7] hover:text-white'
              }`}
            >
              Dark Civic Map
            </button>
            <button
              onClick={() => setBasemap('osm')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                basemap === 'osm'
                  ? 'bg-[#142645] text-[#F4F8FF]'
                  : 'text-[#8BA3C7] hover:text-white'
              }`}
            >
              OpenStreetMap
            </button>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="p-4 border-b border-[#172844]">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#7C93B6] mb-2.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Geospatial Layers</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(LAYER_META) as MapLayerType[]).map((key) => {
              const meta = LAYER_META[key];
              const Icon = meta.icon;
              const enabled = activeLayers[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleLayer(key)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                    enabled
                      ? 'bg-[#0F1E37] border-[#243E66] text-[#F1F5FB]'
                      : 'bg-transparent border-[#152540] text-[#6B82A6]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: enabled ? meta.color : '#334E75',
                    }}
                  />
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span className="truncate">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asset Directory List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 text-[11px] font-medium text-[#738BB0]">
            Mapped Features ({visibleAssets.length})
          </div>
          {visibleAssets.map((asset) => {
            const meta = LAYER_META[asset.layer];
            const isSelected = asset.id === selectedAssetId;
            return (
              <button
                key={asset.id}
                onClick={() => handleSelectAsset(asset)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-[#122544] border-cyan-400/50'
                    : 'bg-[#0C172B] border-[#172844] hover:bg-[#101F38]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#8BA3C7]">
                  <span style={{ color: meta.color }} className="font-medium">
                    {meta.label}
                  </span>
                  <span className="font-mono tabular-nums">{asset.ward}</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-[#F1F5FB] truncate">
                  {asset.name}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#9BB0CE]">
                  <span>{asset.metricLabel}</span>
                  <span className="font-mono text-cyan-300 tabular-nums">
                    {asset.metricValue}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Leaflet Canvas */}
      <div className="relative flex-1 min-h-[460px] bg-[#071122]">
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full z-0"
          aria-label="Interactive OpenStreetMap geospatial map of village infrastructure"
        />

        {/* Compact Coordinate Strip (Bottom Left) */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#091222]/90 border border-[#1E3354] text-[11px] font-mono text-[#9BB0CE] tabular-nums">
          <span>
            Center: {village.centerLat.toFixed(4)}°N, {village.centerLng.toFixed(4)}°E
          </span>
          <span aria-hidden="true">·</span>
          <span>Area: {village.areaHectares} ha</span>
        </div>
      </div>
    </div>
  );
};
