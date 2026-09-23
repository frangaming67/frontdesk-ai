import { ImageResponse } from "next/og";

export const alt = "FrontDesk AI — A new patient inquiry becomes a consultation request.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#F4F6F4", color: "#0D2B29", padding: "52px 60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            FrontDesk <span style={{ color: "#1F6F5C", marginLeft: 8 }}>AI</span>
          </div>
          <div style={{ display: "flex", border: "1px solid #DCE3DE", borderRadius: 30, padding: "10px 18px", fontSize: 18, color: "#3C5250" }}>
            Built for dental practices
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 46 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
            <div style={{ fontSize: 62, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08 }}>
              Never miss a new patient again.
            </div>
            <div style={{ fontSize: 25, lineHeight: 1.5, color: "#3C5250", marginTop: 24 }}>
              Answer questions. Capture interest.
              Turn inquiries into consultation requests.
            </div>
            <div style={{ display: "flex", marginTop: 30, color: "#1F6F5C", fontSize: 22, fontWeight: 700 }}>
              Ready to respond, day or night.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: 470, border: "1px solid #DCE3DE", borderRadius: 26, background: "#FFFFFF", padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 20, borderBottom: "1px solid #E9EEEA" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 24, background: "#14544A", color: "white", fontSize: 18, fontWeight: 700 }}>MS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>Miami Smile Dental</div>
                <div style={{ fontSize: 16, color: "#3C5250" }}>AI receptionist demo</div>
              </div>
            </div>
            <div style={{ display: "flex", alignSelf: "flex-end", marginTop: 22, marginLeft: 30, borderRadius: 18, background: "#0D2B29", color: "white", padding: "16px 20px", fontSize: 21, lineHeight: 1.4 }}>
              Hi! I’m interested in Invisalign.
            </div>
            <div style={{ display: "flex", marginTop: 14, marginRight: 20, borderRadius: 18, background: "#F4F6F4", padding: "16px 20px", fontSize: 21, lineHeight: 1.4 }}>
              I can help you request a consultation. What’s your name?
            </div>
            <div style={{ display: "flex", marginTop: 22, borderRadius: 12, background: "#E6F0EC", color: "#14544A", padding: "13px 16px", fontSize: 19, fontWeight: 700 }}>
              Consultation request captured
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 17, color: "#3C5250" }}>
          Explore the interactive demo • Fictional practice
        </div>
      </div>
    ),
    size
  );
}
