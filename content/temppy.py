import pandas as pd
import requests
from tqdm import tqdm

# File paths
input_file = "content/flagg.csv"  # Input CSV file path
output_file = "content/flagg_checked.csv"  # Output CSV file path

# Load the CSV file
try:
    df = pd.read_csv(input_file)
except FileNotFoundError:
    print(f"Error: File '{input_file}' not found.")
    exit()

# Print all columns for debugging
print("Columns in the CSV:", df.columns)

# Determine if there's a 'links' column or handle no header
if 'links' in df.columns:
    link_column = 'links'
elif 'URL' in df.columns:  # Adjust for alternative column names
    link_column = 'URL'
else:
    # Assume no header and links are in the first column
    df = pd.read_csv(input_file, header=None)
    link_column = 0
    print("No header detected. Assuming links are in the first column.")

# Initialize list to store link statuses
statuses = []

# Check each link
print("Starting to check links...")
for index, link in enumerate(tqdm(df[link_column], desc="Processing links"), start=1):
    print(f"\n[{index}/{len(df[link_column])}] Checking: {link.strip()}")
    try:
        response = requests.get(link.strip(), timeout=5)
        if response.status_code == 200:
            print(f"--> Result: Working")
            statuses.append('Working')
        else:
            print(f"--> Result: Error {response.status_code}")
            statuses.append(f'Error {response.status_code}')
    except requests.exceptions.RequestException as e:
        print(f"--> Result: Broken ({e})")
        statuses.append('Broken')

# Add statuses to the DataFrame
df['status'] = statuses

# Save the results to a new CSV file
try:
    df.to_csv(output_file, index=False)
    print(f"\nLink check completed! Results saved to '{output_file}'.")
except Exception as e:
    print(f"Error saving the output file: {e}")