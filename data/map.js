// Map Projection & Coordinates Data (equirectangular plate carrée projection for 840x506 PNG)
// x = (lon + 180) * (840 / 360), y = (90 - lat) * (506 / 180)
const MAP_DATA = {
  mapImage: "assets/wireframe-map-of-the-world-world.png",
  width: 840,
  height: 506,
  cities: {
    kolkata: { name: "Kolkata", x: 626.1, y: 189.5, flag: "🇮🇳" },
    vadodara: { name: "Vadodara", x: 590.9, y: 190.3, flag: "🇮🇳" },
    mumbai: { name: "Mumbai", x: 590.2, y: 199.3, flag: "🇮🇳" },
    hyderabad: { name: "Hyderabad", x: 603.1, y: 204.1, flag: "🇮🇳" },
    kuwait: { name: "Kuwait City", x: 530.9, y: 170.4, flag: "🇰🇼" },
    dubai: { name: "Dubai", x: 549.0, y: 182.1, flag: "🇦🇪" }
  },
  connections: [
    { from: "kolkata", to: "vadodara" },
    { from: "vadodara", to: "mumbai" },
    { from: "mumbai", to: "kuwait" },
    { from: "kuwait", to: "dubai" },
    { from: "dubai", to: "mumbai" },
    { from: "mumbai", to: "hyderabad" }
  ]
};
