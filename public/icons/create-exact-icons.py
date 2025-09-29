#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw
import xml.etree.ElementTree as ET

def create_shopshap_icon_from_svg(size):
    """Crée une icône ShopShap en utilisant directement le SVG ShoppingBag"""
    # Créer une image avec fond transparent
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Couleurs exactes du logo landing page
    orange_bg = (249, 115, 22)  # bg-orange-500
    white = (255, 255, 255)
    
    # Dessiner le carré arrondi orange (comme sur la landing page)
    center = size // 2
    square_size = int(size * 0.8)  # 80% de la taille
    corner_radius = int(size * 0.15)  # Coins arrondis comme rounded-lg
    
    # Position du carré
    square_x = center - square_size // 2
    square_y = center - square_size // 2
    
    # Dessiner le carré arrondi orange
    draw.rounded_rectangle(
        [square_x, square_y, square_x + square_size, square_y + square_size],
        radius=corner_radius,
        fill=orange_bg
    )
    
    # SVG ShoppingBag exact du composant (viewBox="0 0 24 24")
    # Path: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    
    # Échelle pour adapter le SVG 24x24 au carré orange
    scale = square_size / 24.0
    stroke_width = max(1, int(scale * 1.5))  # strokeWidth="1.5"
    
    # Fonction pour convertir coordonnées SVG en pixels
    def svg_to_px(x, y):
        return (int(square_x + x * scale), int(square_y + y * scale))
    
    # 1. Dessiner le corps du sac en premier (trapèze avec coins arrondis)
    # Points du sac selon le path SVG complexe
    bag_top_left = svg_to_px(5.513, 7.5)
    bag_top_right = svg_to_px(18.487, 7.5)  
    bag_bottom_right = svg_to_px(19.75, 19.5)
    bag_bottom_left = svg_to_px(4.25, 19.5)
    
    # Dessiner le contour du sac avec des lignes épaisses
    for i in range(stroke_width):
        offset = i * 0.5
        # Ligne du haut
        draw.line([bag_top_left[0] - offset, bag_top_left[1], 
                  bag_top_right[0] + offset, bag_top_right[1]], fill=white, width=1)
        # Ligne droite
        draw.line([bag_top_right[0] + offset, bag_top_right[1], 
                  bag_bottom_right[0] + offset, bag_bottom_right[1]], fill=white, width=1)
        # Ligne du bas
        draw.line([bag_bottom_right[0] + offset, bag_bottom_right[1], 
                  bag_bottom_left[0] - offset, bag_bottom_left[1]], fill=white, width=1)
        # Ligne gauche
        draw.line([bag_bottom_left[0] - offset, bag_bottom_left[1], 
                  bag_top_left[0] - offset, bag_top_left[1]], fill=white, width=1)
    
    # 2. Dessiner les poignées du sac selon le SVG exact
    # Path: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5"
    # Cela signifie: ligne de (15.75,10.5) vers (15.75,6), puis arc de rayon 3.75, puis ligne vers (8.25,6) puis vers (8.25,10.5)
    
    # Points des poignées
    right_handle_bottom = svg_to_px(15.75, 10.5)
    right_handle_top = svg_to_px(15.75, 6)
    left_handle_top = svg_to_px(8.25, 6)
    left_handle_bottom = svg_to_px(8.25, 10.5)
    
    # Dessiner les lignes verticales des poignées (stroke seulement, pas de fill)
    for i in range(stroke_width):
        offset = i * 0.3
        # Ligne verticale droite
        draw.line([right_handle_bottom[0] + offset, right_handle_bottom[1], 
                  right_handle_top[0] + offset, right_handle_top[1]], fill=white, width=1)
        # Ligne verticale gauche  
        draw.line([left_handle_bottom[0] - offset, left_handle_bottom[1], 
                  left_handle_top[0] - offset, left_handle_top[1]], fill=white, width=1)
    
    # 3. Dessiner l'arc de connexion entre les poignées
    # Arc centré entre les deux poignées, radius 3.75
    arc_center_x = (left_handle_top[0] + right_handle_top[0]) // 2
    arc_center_y = right_handle_top[1]
    arc_radius = int(3.75 * scale)
    
    # L'arc va de 180° à 360° (demi-cercle supérieur)
    for i in range(stroke_width):
        offset = i * 0.3
        draw.arc([arc_center_x - arc_radius - offset, arc_center_y - arc_radius - offset,
                 arc_center_x + arc_radius + offset, arc_center_y + arc_radius + offset], 
                 180, 360, fill=white, width=1)
    
    # 3. Dessiner les points décoratifs
    dot_radius = max(1, int(0.375 * scale))  # radius="0.375"
    
    # Point gauche (8.625, 10.5)
    left_dot = svg_to_px(8.625, 10.5)
    draw.ellipse([left_dot[0] - dot_radius, left_dot[1] - dot_radius,
                 left_dot[0] + dot_radius, left_dot[1] + dot_radius], fill=white)
    
    # Point droit (15.375, 10.5) 
    right_dot = svg_to_px(15.375, 10.5)
    draw.ellipse([right_dot[0] - dot_radius, right_dot[1] - dot_radius,
                 right_dot[0] + dot_radius, right_dot[1] + dot_radius], fill=white)
    
    return img

# Créer le dossier icons s'il n'existe pas
icons_dir = '/Users/macook/Desktop/shopshap/public/icons'
os.makedirs(icons_dir, exist_ok=True)

# Tailles d'icônes PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

print("Génération des icônes PWA ShopShap (reproduction exacte du SVG)...")

for size in sizes:
    icon = create_shopshap_icon_from_svg(size)
    filename = f'icon-{size}x{size}.png'
    filepath = os.path.join(icons_dir, filename)
    icon.save(filepath, 'PNG')
    print(f"✅ {filename} créé")

print("🎉 Icônes PWA générées avec le SVG ShoppingBag exact!")
