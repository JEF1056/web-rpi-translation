import os
import re
from simplet5 import SimpleT5

def get_val_loss(filename):
    return int(re.search(r"val-loss-\d+\.(\d+)", filename).group(1))

model_type="mt5"
base_model="google/mt5-small"
model_dir = "model/mt5-small"

# instantiate
model = SimpleT5()

model_path = ""
if os.path.exists(model_dir) and os.path.isdir(model_dir):
    loadable_models = {get_val_loss(f): f for f in os.listdir(model_dir)}
    load_model = loadable_models[max(loadable_models, key=loadable_models.get)]
    model_path = os.path.join(model_dir, load_model)

if model_path:
    print(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOADING FROM {model_path}")
    model.load_model(model_type, model_path, use_gpu=True)
else:
    print(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~NEW {base_model}")
    model.from_pretrained(model_type, base_model)

# predict
while True:
    print(model.predict(input("> "))[0])