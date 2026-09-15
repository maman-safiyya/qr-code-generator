"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const primaryColor = "#0ea5e9";

export default function QRCodePage() {
  const [value, setValue] = useState("https://saukisub.com/download");
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [size, setSize] = useState(320);
  const [dataUrl, setDataUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    let active = true;
    const render = async () => {
      if (!value.trim()) return;
      const options = {
        width: size,
        margin: 2,
        color: { dark: foreground, light: background },
        errorCorrectionLevel: "H",
      };
      const [url, svgMarkup] = await Promise.all([
        QRCode.toDataURL(value, options),
        QRCode.toString(value, { ...options, type: "svg" }),
      ]);
      if (active) {
        setDataUrl(url);
        setSvg(svgMarkup);
      }
    };
    render();
    return () => {
      active = false;
    };
  }, [value, foreground, background, size]);

  const download = (type) => {
    if (!dataUrl && !svg) return;
    const link = document.createElement("a");
    link.download = `qr-code.${type}`;
    link.href =
      type === "png"
        ? dataUrl
        : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    link.click();
  };

  const share = async () => {
    if (navigator.share)
      await navigator.share({ title: "My QR code", text: value });
    else {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <main className="qr-page">
      <section className="hero">
        <div className="eyebrow">
          <span>✦</span> SIMPLE. BEAUTIFUL. YOURS.
        </div>
        <h1>
          Turn anything into a<br />
          <em>beautiful</em> QR code.
        </h1>
        <p className="subtitle">
          Create, customize, and share your QR code in seconds.
        </p>
      </section>
      <section className="workspace">
        <div className="panel controls">
          <label htmlFor="content">Your content</label>
          <div className="input-wrap">
            <span>↗</span>
            <input
              id="content"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste a link or type text..."
            />
          </div>
          <div className="divider" />
          <label>Customize</label>
          <div className="color-row">
            <div>
              <span>QR color</span>
              <label className="color-input">
                <input
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                />
                {foreground}
              </label>
            </div>
            <div>
              <span>Background</span>
              <label className="color-input">
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                />
                {background}
              </label>
            </div>
          </div>
          <label className="size-label">
            Size <b>{size}px</b>
          </label>
          <input
            className="range"
            type="range"
            min="180"
            max="520"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <button className="share" onClick={share}>
            ⌯ &nbsp; {copied ? "Copied!" : "Share QR code"}
          </button>
        </div>
        <div className="panel preview-panel">
          <div className="preview-head">
            <span>PREVIEW</span>
            <span className="live">
              <i /> LIVE
            </span>
          </div>
          <div className="qr-stage">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="Generated QR code"
                style={{ width: `${Math.min(size, 340)}px` }}
              />
            ) : (
              <span>Enter some content</span>
            )}
          </div>
          <div className="download-row">
            <button onClick={() => download("png")}>
              ↓ &nbsp; Download PNG
            </button>
            <button onClick={() => download("svg")}>
              ↓ &nbsp; Download SVG
            </button>
          </div>
          <p className="hint">High resolution · No watermark · Yours to use</p>
        </div>
      </section>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Sauki Sub LTD</p>
        <p>Built with love 💙, by the team at Sauki Sub LTD.</p>
      </footer>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,600&display=swap");
        * {
          box-sizing: border-box;
        }
        .qr-page {
          min-height: 100vh;
          background: #f7f7f4;
          color: #172018;
          font-family: "DM Sans", sans-serif;
          padding: 70px 24px 90px;
        }
        .site-footer {
          text-align: center;
          color: #7b857b;
          font-size: 12px;
          line-height: 1.6;
          margin-top: 54px;
        }
        .site-footer p {
          margin: 0;
        }
        .site-footer p + p {
          color: #9aa39a;
          margin-top: 2px;
        }
        .hero {
          text-align: center;
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 2.4px;
          font-weight: 700;
          color: #71806f;
          margin-bottom: 20px;
        }
        .eyebrow span {
          color: ${primaryColor};
          font-size: 16px;
          margin-right: 8px;
        }
        .hero h1 {
          font-size: clamp(38px, 5vw, 64px);
          letter-spacing: -3px;
          line-height: 1.05;
          margin: 0;
          font-weight: 600;
        }
        .hero h1 em {
          font-family: "Playfair Display", serif;
          color: ${primaryColor};
        }
        .subtitle {
          color: #788177;
          font-size: 16px;
          margin: 20px 0 48px;
        }
        .workspace {
          max-width: 930px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .panel {
          background: white;
          border: 1px solid #e8e9e4;
          border-radius: 18px;
          padding: 30px;
          box-shadow: 0 12px 35px #1d302108;
        }
        .controls label,
        .preview-head {
          font-size: 11px;
          letter-spacing: 1.5px;
          font-weight: 700;
          text-transform: uppercase;
          color: #69766b;
        }
        .input-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid #dfe3dc;
          border-radius: 9px;
          margin-top: 12px;
          padding: 0 14px;
          height: 52px;
          color: ${primaryColor};
        }
        .input-wrap input {
          border: 0;
          outline: 0;
          width: 100%;
          font: inherit;
          color: #273229;
        }
        .divider {
          height: 1px;
          background: #eef0eb;
          margin: 30px 0;
        }
        .color-row {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }
        .color-row > div {
          flex: 1;
        }
        .color-row span {
          display: block;
          font-size: 12px;
          color: #788177;
          margin-bottom: 8px;
        }
        .color-input {
          display: flex !important;
          align-items: center;
          gap: 8px;
          text-transform: none !important;
          letter-spacing: 0 !important;
          font-size: 12px !important;
          color: #374138 !important;
          font-weight: 400 !important;
        }
        .color-input input {
          width: 30px;
          height: 30px;
          border: 0;
          padding: 0;
          background: none;
        }
        .size-label {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
        }
        .size-label b {
          font-size: 12px;
          color: ${primaryColor};
        }
        .range {
          width: 100%;
          accent-color: ${primaryColor};
          margin: 14px 0 25px;
        }
        .share,
        .download-row button {
          border: 0;
          background: #1d3327;
          color: white;
          border-radius: 8px;
          height: 48px;
          font: 600 13px inherit;
          cursor: pointer;
        }
        .share {
          width: 100%;
          background: ${primaryColor};
        }
        .preview-panel {
          display: flex;
          flex-direction: column;
        }
        .preview-head {
          display: flex;
          justify-content: space-between;
        }
        .live {
          color: #83a17f !important;
          font-size: 10px !important;
        }
        .live i {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #8aae83;
          border-radius: 50%;
          margin-right: 5px;
        }
        .qr-stage {
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 12px 0;
          background: #fcfcfa;
          border-radius: 10px;
        }
        .qr-stage img {
          max-width: 100%;
          image-rendering: pixelated;
        }
        .download-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .download-row button {
          background: #fff;
          color: #273229;
          border: 1px solid #dfe3dc;
        }
        .hint {
          text-align: center;
          color: #98a098;
          font-size: 11px;
          margin: 17px 0 0;
        }
        @media (max-width: 700px) {
          .qr-page {
            padding-top: 40px;
          }
          .workspace {
            grid-template-columns: 1fr;
          }
          .hero h1 {
            letter-spacing: -2px;
          }
          .preview-panel {
            order: -1;
          }
          .qr-stage {
            min-height: 270px;
          }
        }
      `}</style>
    </main>
  );
}
