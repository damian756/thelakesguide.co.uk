"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon, latLngBounds } from "leaflet";
import type { MapPin } from "./CategoryMapTypes";
export type { MapPin } from "./CategoryMapTypes";
export { MapSkeleton } from "./CategoryMapTypes";

type Props = {
  pins: MapPin[];
  accentColor: string;
};

const DEFAULT_CENTER: [number, number] = [53.6452, -3.0056];
const DEFAULT_ZOOM = 13;

export default function CategoryMap({ pins, accentColor }: Props) {
  const validPins = pins.filter((p) => p.lat && p.lng);
  const markerColor = accentColor || "#1B2E4B";

  const bounds = useMemo(() => {
    if (validPins.length > 1) {
      return latLngBounds(validPins.map((p) => [p.lat, p.lng] as [number, number]));
    }
    return undefined;
  }, [validPins]);

  const center: [number, number] =
    validPins.length === 1
      ? [validPins[0].lat, validPins[0].lng]
      : DEFAULT_CENTER;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 520 }}>
      <MapContainer
        center={center}
        zoom={validPins.length === 1 ? 15 : DEFAULT_ZOOM}
        bounds={bounds ?? undefined}
        boundsOptions={{ padding: [40, 40], maxZoom: 15 }}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {validPins.map((pin) => {
          const isFeatured = pin.listingTier === "featured" || pin.listingTier === "premium";
          const bgColor = isFeatured ? "#C9A84C" : markerColor;

          const icon = divIcon({
            className: "",
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -32],
            html: `<div style="
              width:28px;height:28px;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              background:${bgColor};
              border:2px solid white;
              box-shadow:0 2px 6px rgba(0,0,0,0.35);
            "></div>`,
          });

          const ratingHtml = pin.rating
            ? `<span style="display:inline-flex;align-items:center;gap:3px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:12px;padding:2px 8px;font-size:11px;font-weight:700;">★ ${pin.rating.toFixed(1)}${pin.reviewCount ? ` (${pin.reviewCount.toLocaleString()})` : ""}</span>`
            : "";

          const priceHtml = pin.priceRange
            ? `<span style="color:#6b7280;font-size:11px;font-weight:600;">${pin.priceRange}</span>`
            : "";

          return (
            <Marker key={pin.slug} position={[pin.lat, pin.lng]} icon={icon}>
              <Popup maxWidth={240}>
                <div style={{ fontFamily: "system-ui,sans-serif", padding: "2px 0" }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#1B2E4B", margin: "0 0 4px" }}>{pin.name}</p>
                  <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 8px" }}>{pin.address.split(",")[0]}</p>
                  {(ratingHtml || priceHtml) && (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}
                      dangerouslySetInnerHTML={{ __html: ratingHtml + priceHtml }}
                    />
                  )}
                  <a
                    href={`/${pin.category}/${pin.slug}`}
                    style={{
                      display: "inline-block",
                      background: bgColor,
                      color: "white",
                      textDecoration: "none",
                      borderRadius: 20,
                      padding: "5px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    View listing →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs text-gray-600 flex items-center gap-3 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: accentColor }} />
          Standard
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block bg-[#C9A84C]" />
          Featured
        </span>
      </div>
    </div>
  );
}

