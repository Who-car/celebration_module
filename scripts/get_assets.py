from PIL import Image
import os
import sys
import glob

def extract_sprites(sprite_sheet_path, output_folder="assets/game"):
    """
    Разбивает спрайт-лист на отдельные файлы 16x16 с прозрачным фоном
    """
    # Создаём папку для ассетов
    os.makedirs(output_folder, exist_ok=True)
    
    # Открываем изображение
    img = Image.open(sprite_sheet_path)
    img = img.convert("RGBA")  # Конвертируем в RGBA для прозрачности
    
    # Размеры
    TILE_SIZE = 16
    width, height = img.size
    cols = width // TILE_SIZE
    rows = height // TILE_SIZE
    
    print(f"📐 Размер спрайт-листа: {width}x{height}")
    print(f"📦 Сетка: {cols}x{rows} = {cols * rows} спрайтов")
    print(f"💾 Сохраняю в папку: {output_folder}/\n")
    
    saved_count = 0
    sprite_info = []
    
    # Проходим по всей сетке
    for row in range(rows):
        for col in range(cols):
            # Вырезаем спрайт 16x16
            left = col * TILE_SIZE
            top = row * TILE_SIZE
            right = left + TILE_SIZE
            bottom = top + TILE_SIZE
            
            sprite = img.crop((left, top, right, bottom))
            
            # Делаем чёрный фон прозрачным
            pixels = sprite.load()
            has_content = False
            
            for y in range(TILE_SIZE):
                for x in range(TILE_SIZE):
                    r, g, b, a = pixels[x, y]
                    # Если пиксель чёрный (или очень тёмный)
                    if r < 30 and g < 30 and b < 30:
                        pixels[x, y] = (0, 0, 0, 0)  # Прозрачный
                    else:
                        has_content = True
            
            # Сохраняем только если есть содержание
            if has_content:
                filename = f"sprite_{saved_count:03d}.png"
                filepath = os.path.join(output_folder, filename)
                sprite.save(filepath, "PNG")
                
                sprite_info.append({
                    'index': saved_count,
                    'row': row,
                    'col': col,
                    'filename': filename
                })
                
                saved_count += 1
                print(f"✅ [{row:2d}:{col:2d}] → {filename}")
    
    print(f"\n💾 Всего сохранено: {saved_count} спрайтов")
    
    # Сохраняем информацию о спрайтах в JSON
    import json
    info_file = os.path.join(output_folder, "sprites_info.json")
    with open(info_file, 'w', encoding='utf-8') as f:
        json.dump(sprite_info, f, indent=2, ensure_ascii=False)
    
    print(f"📄 Информация сохранена в: {info_file}")
    print("\n🎉 Готово! Теперь переименуй спрайты вручную:")
    print("   - tank_player.png (игрок)")
    print("   - tank_enemy.png (враг)")
    print("   - wall_brick.png (кирпич)")
    print("   - wall_steel.png (сталь)")
    print("   - base.png (база)")
    print("   - bullet.png (пуля)")
    print("   и т.д.")

if __name__ == "__main__":
    # Если передали путь как аргумент
    # if len(sys.argv) > 1:
    #     sprite_path = sys.argv[1]
    # else:
    #     # Иначе спрашиваем
    #     sprite_path = input("📁 Введи путь к спрайт-листу: ").strip()
    
    # if os.path.exists(sprite_path):
    #     extract_sprites(sprite_path)
    # else:
    #     print(f"❌ Файл не найден: {sprite_path}")
    files = []
    for file_name in glob.glob("../assets/game/*"):
        files.append(file_name.split('/')[-1])
    
    for file in sorted(files):
        print(file)