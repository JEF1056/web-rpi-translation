Data was extracted from https://www.manythings.org/anki/

Processing done:
1. Extract .txt (TSV format) files all .zip files into `raw`
2. In `raw`, rename three-letter country codes into full names (note: this name will be directly used in the dataset)
3. create folder `processed`
4. Run `process.py`