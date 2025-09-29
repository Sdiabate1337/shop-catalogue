const fs = require('fs');
const path = require('path');

// SVG du logo ShopShap (basé sur le design existant)
const logoSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#22c55e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="url(#bg)" />
  
  <!-- Shopping bag icon -->
  <g transform="translate(256,256)">
    <path d="M-60 -40 L60 -40 L50 80 L-50 80 Z" fill="white" stroke="none"/>
    <path d="M-40 -40 L-40 -60 C-40 -80 -20 -100 0 -100 C20 -100 40 -80 40 -60 L40 -40" 
          fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-25" cy="20" r="6" fill="#22c55e"/>
    <circle cx="25" cy="20" r="6" fill="#22c55e"/>
  </g>
</svg>
`;

// Fonction pour créer les fichiers SVG temporaires et les convertir
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Génération des icônes PWA pour ShopShap...');

// Créer le SVG de base
const svgPath = path.join(__dirname, '../public/icons/logo.svg');
fs.writeFileSync(svgPath, logoSVG);

console.log('✅ Logo SVG créé');
console.log('📝 Pour générer les PNG, utilisez un outil comme:');
console.log('   - ImageMagick: convert logo.svg -resize 192x192 icon-192x192.png');
console.log('   - Ou un service en ligne comme realfavicongenerator.net');

// Instructions pour chaque taille
sizes.forEach(size => {
  console.log(`   convert logo.svg -resize ${size}x${size} icon-${size}x${size}.png`);
});
