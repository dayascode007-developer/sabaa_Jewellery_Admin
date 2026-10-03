import os from "os";

// Next blocks cross-origin requests to /_next dev resources by default, so
// opening the admin panel on a LAN address serves the HTML but never the JS
// chunks — the page renders and nothing is interactive. The machine's own
// LAN addresses are detected here, so it works on whichever laptop runs it and
// keeps working after DHCP hands out a different IP. Same approach as the
// customer site's next.config.mjs.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net.address);

// The API base URL is baked into the browser bundle, so "localhost" would mean
// the *visitor's* machine — opening the panel from a second laptop refuses every
// request. Defaulting to this machine's LAN address makes the same build work
// from here and from any device on the wifi, and it follows the IP when DHCP
// changes it. Setting NEXT_PUBLIC_API_URL in .env still wins.
const apiPort = process.env.API_PORT || "5000";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || `http://${lanAddresses[0] ?? "localhost"}:${apiPort}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_API_URL: apiUrl },
  // was: allowedDevOrigins: ['192.168.29.163', 'localhost'],
  allowedDevOrigins: [...new Set(["192.168.29.163", "localhost", ...lanAddresses])],
};

export default nextConfig;
