# Importing library
import qrcode
import os

# Ensure the folder exists
folder = 'qrcodes'
os.makedirs(folder, exist_ok=True)
 
# Data to be encoded
presentLink = 'https://dorchester-micro-games.vercel.app/present/present.html'
pastLink = 'https://dorchester-micro-games.vercel.app/past/past.html'
futureLink = 'https://dorchester-micro-games.vercel.app/future/future.html'
 
# Encoding data using make() function
presentImg = qrcode.make(presentLink)
pastImg = qrcode.make(pastLink)
futureImg = qrcode.make(futureLink)


# Saving as an image file in the specified folder
presentImg.save(os.path.join(folder, 'present.png'))
pastImg.save(os.path.join(folder, 'past.png'))
futureImg.save(os.path.join(folder, 'future.png'))