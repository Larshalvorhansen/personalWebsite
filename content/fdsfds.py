import csv
import random

# Load the file
with open('content/landOgHovedstad_with_images.csv', 'r') as infile:
    lines = infile.readlines()

# Randomize the order
random.shuffle(lines)

# Save to a new file
with open('content/ny.csv', 'w') as outfile:
    outfile.writelines(lines)