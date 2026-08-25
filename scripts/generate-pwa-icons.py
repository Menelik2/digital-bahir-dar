#!/usr/bin/env python3
"""Generate minimal PWA PNG icons (Ethiopian green disc). Runs on prebuild / CI."""
import struct, zlib, os

def write_png(path, size, rgb=(7, 137, 48)):
    w = h = size
    r, g, b = rgb
    raw = b""
    for y in range(h):
        raw += b"\x00"
        for x in range(w):
            cx, cy = w / 2, h / 2
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if d < size * 0.38:
                raw += bytes([255, 255, 255, 255])
            else:
                raw += bytes([r, g, b, 255])
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    open(path, "wb").write(png)
    print("wrote", path)

if __name__ == "__main__":
    root = os.path.join(os.path.dirname(__file__), "..", "public")
    write_png(os.path.join(root, "pwa-192.png"), 192)
    write_png(os.path.join(root, "pwa-512.png"), 512)
