import re
import os


def get_val_loss(filename):
    return float(re.search(r"val-loss-(\d+\.\d+)", filename).group(1))

def get_best_model_path(model_dir):
    model_path = ""
    if os.path.exists(model_dir) and os.path.isdir(model_dir):
        loadable_models = {get_val_loss(f): f for f in os.listdir(model_dir)}
        load_model = loadable_models[max(loadable_models, key=loadable_models.get)]
        model_path = os.path.join(model_dir, load_model)
        
    if model_path:
        return model_path