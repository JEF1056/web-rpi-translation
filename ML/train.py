import pandas as pd
from simplet5 import SimpleT5
from helpers import get_best_model_path

model_type="mt5"
base_model="google/mt5-base"
model_dir = "model/mt5-base"

train_ds = pd.read_csv("dataset/processed/train.csv").dropna().astype(str)
valid_ds = pd.read_csv("dataset/processed/valid.csv").dropna().astype(str)

train_ds = train_ds.sample(frac=1).reset_index(drop=True)
valid_ds = valid_ds.sample(frac=1).reset_index(drop=True)

train_ds.drop(train_ds.columns.difference(['source_text','target_text']), 1, inplace=True)
valid_ds.drop(valid_ds.columns.difference(['source_text','target_text']), 1, inplace=True)

print(train_ds.head())
print(valid_ds.head())

# Using T5 instead of T5v1.1 sbecasue it already has summarization embeddings
model = SimpleT5()

model_path = get_best_model_path(model_dir)

if model_path:
    print(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOADING FROM {model_path}")
    model.load_model(model_type, model_path, use_gpu=True)
else:
    print(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~NEW {base_model}")
    model.from_pretrained(model_type, base_model)

model.train(train_df=train_ds,
            eval_df=valid_ds,
            source_max_token_len = 64, 
            target_max_token_len = 64,
            batch_size = 32,
            max_epochs = 3,
            use_gpu = True,
            outputdir = model_dir,
            early_stopping_patience_epochs = 1,
            dataloader_num_workers=4,
            )