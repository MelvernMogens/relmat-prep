#!/usr/bin/env python3
"""Emit slide->media mapping + any embedded text for W7 pptx."""
import re, zipfile, sys

PPTX = 'sources/Week 7-Managing customer bonding.pptx'
z = zipfile.ZipFile(PPTX)
for i in range(1, 19):
    rels = z.read(f'ppt/slides/_rels/slide{i}.xml.rels').decode('utf-8', 'ignore')
    media = re.findall(r'media/(image\d+\.\w+)', rels)
    xml = z.read(f'ppt/slides/slide{i}.xml').decode('utf-8', 'ignore')
    texts = re.findall(r'<a:t>([^<]*)</a:t>', xml)
    print(f'slide{i} -> {media} | text: {" ".join(texts)!r}')
