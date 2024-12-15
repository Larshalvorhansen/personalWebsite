from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd

def fetch_capital_image(city_name):
    """
    Fetches the image URL for a given capital city using the Wikidata SPARQL API.
    """
    query = f"""
    SELECT ?image WHERE {{
      ?capital rdfs:label "{city_name}"@en .
      OPTIONAL {{ ?capital wdt:P18 ?image. }}
    }}
    """
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    
    try:
        results = sparql.query().convert()
        for result in results["results"]["bindings"]:
            if "image" in result:
                return result["image"]["value"]
        return None  # No image found
    except Exception as e:
        print(f"Error fetching image for {city_name}: {e}")
        return None

# Load the CSV file
file_path = "content/landOgHovedstad.csv"
df = pd.read_csv(file_path)

# Add a new column for the images
image_results = []
for index, row in df.iterrows():
    capital = row[0]  # Assuming the first column contains the capital names
    print(f"Processing {capital}...")  # Log progress
    
    try:
        image_url = fetch_capital_image(capital)
        if image_url:
            print(f"{capital}: Image found!")
        else:
            print(f"{capital}: No image found.")
    except Exception as e:
        print(f"Error processing {capital}: {e}")
        image_url = None
    
    image_results.append(image_url)

# Add the image results to the DataFrame
df["Capital City Image"] = image_results

# Save the updated DataFrame to a new file
output_path = "landOgHovedstad_with_images.csv"
df.to_csv(output_path, index=False)

print(f"Updated CSV saved to {output_path}")