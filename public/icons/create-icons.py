#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw
import math

def create_shopshap_icon(size):
    """Crée une icône ShopShap identique au logo de la landing page"""
    # Créer une image avec fond transparent
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Couleurs exactes du logo landing page
    orange_bg = (249, 115, 22)  # bg-orange-500
    white = (255, 255, 255)
    
    # Dessiner le carré arrondi orange (comme sur la landing page)
    center = size // 2
    square_size = int(size * 0.8)  # 80% de la taille
    corner_radius = int(size * 0.15)  # Coins plus arrondis
    
    # Position du carré
    square_x = center - square_size // 2
    square_y = center - square_size // 2
    
    # Dessiner le carré arrondi orange
    draw.rounded_rectangle(
        [square_x, square_y, square_x + square_size, square_y + square_size],
        radius=corner_radius,
        fill=orange_bg
    )
    
    # Reproduction exacte du SVG ShoppingBag (viewBox 0 0 24 24)
    # Échelle pour adapter au carré orange
    scale = square_size / 24.0
    offset_x = square_x
    offset_y = square_y
    stroke_width = max(1, int(scale * 1.5))
    
    # Convertir les coordonnées SVG en pixels
    def svg_to_px(x, y):
        return (int(offset_x + x * scale), int(offset_y + y * scale))
    
    # Path 1: Poignées du sac "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5"
    # Poignée gauche (x=8.25, de y=6 à y=10.5)
    left_start = svg_to_px(8.25, 6)
    left_end = svg_to_px(8.25, 10.5)
    
    # Arc pour la poignée gauche (3.75 radius)
    arc_left_box = [
        svg_to_px(8.25 - 3.75, 6 - 3.75)[0], svg_to_px(8.25 - 3.75, 6 - 3.75)[1],
        svg_to_px(8.25 + 3.75, 6 + 3.75)[0], svg_to_px(8.25 + 3.75, 6 + 3.75)[1]
    ]
    
    # Poignée droite (x=15.75, de y=6 à y=10.5)  
    right_start = svg_to_px(15.75, 6)
    right_end = svg_to_px(15.75, 10.5)
    
    # Arc pour la poignée droite
    arc_right_box = [
        svg_to_px(15.75 - 3.75, 6 - 3.75)[0], svg_to_px(15.75 - 3.75, 6 - 3.75)[1],
        svg_to_px(15.75 + 3.75, 6 + 3.75)[0], svg_to_px(15.75 + 3.75, 6 + 3.75)[1]
    ]
    
    # Dessiner les poignées
    for i in range(stroke_width):
        # Ligne verticale gauche
        draw.line([left_start[0] - i//2, left_start[1], left_end[0] - i//2, left_end[1]], fill=white, width=1)
        # Arc gauche
        draw.arc([arc_left_box[0] - i, arc_left_box[1] - i, arc_left_box[2] + i, arc_left_box[3] + i], 
                 180, 360, fill=white, width=1)
        
        # Ligne verticale droite
        draw.line([right_start[0] + i//2, right_start[1], right_end[0] + i//2, right_end[1]], fill=white, width=1)
        # Arc droit
        draw.arc([arc_right_box[0] - i, arc_right_box[1] - i, arc_right_box[2] + i, arc_right_box[3] + i], 
                 180, 360, fill=white, width=1)
    
    # Path 2: Corps du sac - approximation du path complexe
    # Points principaux du sac
    bag_points = [
        svg_to_px(5.513, 7.5),   # Point de départ
        svg_to_px(18.487, 7.5),  # Coin supérieur droit
        svg_to_px(19.75, 19.5),  # Coin inférieur droit
        svg_to_px(4.25, 19.5),   # Coin inférieur gauche
    ]
    
    # Dessiner le contour du sac
    for i in range(stroke_width):
        draw.polygon(bag_points, outline=white, width=1, fill=None)
    
    # Points décoratifs (cercles)
    # Point gauche: x=8.625, y=10.5, radius=0.375
    left_dot_center = svg_to_px(8.625, 10.5)
    dot_radius = max(1, int(scale * 0.375))
    draw.ellipse([
        left_dot_center[0] - dot_radius, left_dot_center[1] - dot_radius,
        left_dot_center[0] + dot_radius, left_dot_center[1] + dot_radius
    ], fill=white)
    
    # Point droit: x=15.375, y=10.5, radius=0.375
    right_dot_center = svg_to_px(15.375, 10.5)
    draw.ellipse([
        right_dot_center[0] - dot_radius, right_dot_center[1] - dot_radius,
        right_dot_center[0] + dot_radius, right_dot_center[1] + dot_radius
    ], fill=white)
    
    return img

# Créer le dossier icons s'il n'existe pas
icons_dir = '/Users/macook/Desktop/shopshap/public/icons'
os.makedirs(icons_dir, exist_ok=True)

# Tailles d'icônes PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

print("Génération des icônes PWA ShopShap...")

for size in sizes:
    icon = create_shopshap_icon(size)
    filename = f'icon-{size}x{size}.png'
    filepath = os.path.join(icons_dir, filename)
    icon.save(filepath, 'PNG')
    print(f"✅ {filename} créé")

print("🎉 Toutes les icônes PWA ont été générées avec succès!")
