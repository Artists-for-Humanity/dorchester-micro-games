import qrcode
import os
from qrcode.image.svg import SvgImage

# Ensure the folder exists
folder = 'svg_qrcodes'
os.makedirs(folder, exist_ok=True)

# Data to be encoded
menuLink = "https://www.ctechinteractives.pro/"
presentLink = 'https://dorchester-micro-games.vercel.app/present/present.html'
pastLink = 'https://dorchester-micro-games.vercel.app/past/past.html'
futureLink = 'https://dorchester-micro-games.vercel.app/future/future.html'

# Create a QRCode object with SVG factory
menuImg = qrcode.make(menuLink, image_factory=SvgImage)
presentImg = qrcode.make(presentLink, image_factory=SvgImage)
pastImg = qrcode.make(pastLink, image_factory=SvgImage)
futureImg = qrcode.make(futureLink, image_factory=SvgImage)

# Saving as SVG files in the specified folder
menuImg.save(os.path.join(folder, 'menu.svg'))
presentImg.save(os.path.join(folder, 'present.svg'))
pastImg.save(os.path.join(folder, 'past.svg'))
futureImg.save(os.path.join(folder, 'future.svg'))
