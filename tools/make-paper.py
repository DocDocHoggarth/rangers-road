"""Generate paper.png, the seamless paper-grain tile. Run once: python3 tools/make-paper.py

The tile is 256px and is shown at 128 CSS px. It is a four-colour palette image
(clear, two strengths of ink, one pale fleck) so it stays small.
"""
import random
from PIL import Image

N = 256
INK = (42, 32, 24)
PALE = (255, 248, 228)
random.seed(7)

img = Image.new('P', (N, N), 0)
px = img.load()

# Fine grain: most pixels clear, a scatter of faint ink and pale flecks.
for y in range(N):
    for x in range(N):
        r = random.random()
        if r < 0.13:
            px[x, y] = 1
        elif r < 0.17:
            px[x, y] = 2
        elif r < 0.26:
            px[x, y] = 3

# Fibres: short, slightly slanted strokes that wrap around the edges so the tile stays seamless.
for _ in range(70):
    x, y = random.uniform(0, N), random.uniform(0, N)
    dx, dy = random.uniform(-1, 1), random.uniform(-0.45, 0.45)
    colour = random.choice((1, 1, 2, 3))
    for _ in range(random.randint(5, 16)):
        px[int(x) % N, int(y) % N] = colour
        x += dx
        y += dy

img.putpalette(list(INK) + list(INK) + list(INK) + list(PALE))
img.save('paper.png', optimize=True, bits=2, transparency=bytes([0, 16, 30, 46]))

# The candlelight theme uses the same tile with the colours swapped: pale fibres, dark flecks.
NIGHT_PALE = (234, 217, 176)
img.putpalette(list(NIGHT_PALE) + list(NIGHT_PALE) + list(NIGHT_PALE) + [0, 0, 0])
img.save('paper-night.png', optimize=True, bits=2, transparency=bytes([0, 10, 20, 60]))
print('wrote paper.png and paper-night.png')
