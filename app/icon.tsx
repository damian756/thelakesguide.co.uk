import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "linear-gradient(135deg, #2A6B8A 0%, #245E3F 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "serif",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          LG
        </span>
      </div>
    ),
    { ...size }
  );
}
