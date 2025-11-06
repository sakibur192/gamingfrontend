import React from "react";
import PP from "./pp";
import FastSpin from "./FastSpin";

export default function Lobby() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "white",
        overflowX: "hidden",
      }}
    >
      <div style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <PP />
      </div>

      <div style={{ padding: "10px 0" }}>
        <FastSpin />
      </div>
    </div>
  );
}
