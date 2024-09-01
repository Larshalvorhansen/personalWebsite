import os

# Define the folder name
folder_name = 'text_files'

# Create the folder if it doesn't exist
os.makedirs(folder_name, exist_ok=True)

# Create 100 text files named text1.txt, text2.txt, ..., text100.txt
for i in range(1, 101):
    file_name = f'text{i}.txt'
    file_path = os.path.join(folder_name, file_name)
    with open(file_path, 'w') as file:
        file.write(f'This is the content of {file_name}')

folder_name
