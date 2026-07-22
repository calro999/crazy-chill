import json
import urllib.request
import urllib.parse
import os
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

os.makedirs('public/images/products', exist_ok=True)

with open('data/products.json', 'r') as f:
    data = json.load(f)

for p in data['products']:
    img_url = p.get('image', '')
    if 'suzuri.jp' in img_url:
        print(f"Downloading {img_url}...")
        
        # Keep original extension or assume webp/jpg based on URL
        if '.webp' in img_url:
            ext = '.webp'
        else:
            ext = '.jpg'
            
        filename = f"{p['id']}{ext}"
        filepath = os.path.join('public/images/products', filename)
        
        if not os.path.exists(filepath):
            req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                with urllib.request.urlopen(req, context=ctx) as response:
                    with open(filepath, 'wb') as out_f:
                        out_f.write(response.read())
            except Exception as e:
                print(f"Failed to download {img_url}: {e}")
                continue
                
        # Update JSON to use local path
        p['image'] = f"/images/products/{filename}"

with open('data/products.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Done!")
