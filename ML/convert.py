import os
import json
import tensorflow as tf
import sentencepiece as spm
from transformers import AutoTokenizer
from helpers import get_best_model_path
from transformers import TFT5ForConditionalGeneration

model_dir = "model/mt5-small"
path = "exported/mt5-small"

model_path = get_best_model_path(model_dir)

assert model_path, "No model found"

max_len = 64

class CustomTFT5(TFT5ForConditionalGeneration):
    def __init__(self, *args, log_dir=None, cache_dir=None, **kwargs):
        super().__init__(*args, **kwargs)

    @tf.function(input_signature=[{
        "input_ids": tf.TensorSpec([None, max_len], tf.int32, name="input_ids"),
        "attention_mask": tf.TensorSpec([None, max_len], tf.int32, name="attention_mask"),
        "decoder_input_ids": tf.TensorSpec([None, max_len], tf.int32, name="decoder_input_ids"),
        "decoder_attention_mask": tf.TensorSpec([None, max_len], tf.int32, name="decoder_attention_mask"),
    }])
    def serving(self, inputs):
      output = self.call(inputs)
      return self.serving_output(output)

os.system(f"rm -rf {path}")

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = CustomTFT5.from_pretrained(model_path, from_pt=True)

# Save the tokenizer files
tokenizer.save_pretrained(os.path.join(path, "tokenizer"), saved_model=True)
tokenizer.save_vocabulary(os.path.join(path, "tokenizer"))

# Save vocab list
json.dump([i[0] for i in json.load(open(os.path.join(path, "tokenizer", "tokenizer.json"), "r"))["model"]["vocab"]], open(os.path.join(path, "tokenizer", "vocab.json"), "w"))

# Load sentencepiece model and pair vocab ids with model scores
sp = spm.SentencePieceProcessor(model_file=os.path.join(path, "tokenizer", 'spiece.model'))
vals = json.load(open(os.path.join(path, "tokenizer", "vocab.json"), "r"))

temp = []
for i in range(len(vals)):
    try:
        temp.append([vals[i], sp.GetScore(i)])
    except: pass
print(len(temp))
json.dump(temp, open(os.path.join(path, "tokenizer", "vocab_model.json"), "w"))

model.save_pretrained(os.path.join(path, "model"), saved_model=True)

converter = tf.lite.TFLiteConverter.from_saved_model(os.path.join(path, "model/saved_model/1"))
converter.optimizations = [tf.lite.Optimize.DEFAULT]
# converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
# converter.inference_input_type = tf.int8  # or tf.uint8
# converter.inference_output_type = tf.int8  # or tf.uint8
tflite_model = converter.convert()
os.mkdir(os.path.join(path, "tflite"))
with open(os.path.join(path, "tflite", "model.tflite"), 'wb') as f:
    f.write(tflite_model)

# convert to tensorflowjs
os.system(f"tensorflowjs_converter --input_format=tf_saved_model --quantize_uint8='*' {path}/model/saved_model/1 {path}/web")