"""Offline asset preparation. Requires opencv-python-headless and Pillow.
Run from the project root; the website itself has no Python dependency.
"""
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
root = Path('dist/images')
images = [cv2.imread(str(root / f'faq-{i}.webp')) for i in range(4)]
for i in range(4):
    first, second = images[i], images[(i+1)%4]
    for name, a, b in [('flow',first,second),('reverse',second,first)]:
        flow = cv2.calcOpticalFlowFarneback(cv2.cvtColor(a,cv2.COLOR_BGR2GRAY),cv2.cvtColor(b,cv2.COLOR_BGR2GRAY),None,.5,5,41,6,7,1.5,0)
        flow = cv2.GaussianBlur(flow,(15,15),3)
        encoded = np.zeros((512,512,3),dtype=np.uint8)
        encoded[:,:,:2] = np.clip(np.round(flow)+128,0,255).astype(np.uint8)
        Image.fromarray(encoded).save(root / f'faq-{name}-{i}.png',optimize=True)
