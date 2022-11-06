import os
import random
import pandas as pd
from tqdm import tqdm

data_folder = "dataset/raw"
output_folder = "dataset/processed"

ds_train = []
ds_valid = []

for file in os.listdir(data_folder):
    if file.endswith(".txt"):
        lang = file[:-4]
        dataset = pd.read_csv(os.path.join(data_folder, file), sep="\t", names=["English", lang, "CC"])
        for _, row in tqdm(dataset.iterrows(), total=len(dataset), desc=f"Processing {lang}"):
            split = random.choices([ds_train, ds_valid], weights=[0.9, 0.1])[0]
            split.extend([
                [f"translate English to {lang}: {row['English'].strip()}", row[lang].strip()],
                [f"translate {lang} to English: {row[lang].strip()}", row['English'].strip()]
            ])
            
pd.DataFrame(ds_train, columns=["source_text", "target_text"]).to_csv(os.path.join(output_folder, "train.csv"), index=False)
pd.DataFrame(ds_valid, columns=["source_text", "target_text"]).to_csv(os.path.join(output_folder, "valid.csv"), index=False)
        