import kagglehub
import pandas as pd
import json
import os
import re
from collections import Counter

# Set target directory
TARGET_DIR = "src/data"
OUTPUT_FILE = os.path.join(TARGET_DIR, "category-keywords.json")

def clean_text(text):
    # Basic cleaning: remove non-alphanumeric, lowercase, split
    text = re.sub(r'[^a-zA-Z\s]', '', str(text)).lower()
    return text.split()

def main():
    print("Downloading dataset...")
    try:
        path = kagglehub.dataset_download("snehaanbhawal/resume-dataset")
        print(f"Dataset downloaded to: {path}")
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        return

    # Look for the CSV file
    csv_path = None
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(".csv"):
                csv_path = os.path.join(root, file)
                break
        if csv_path: break

    if not csv_path:
        print("No CSV file found in dataset.")
        return

    print(f"Processing {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Dataset expected columns: 'Category', 'Resume_str'
    if 'Category' not in df.columns or 'Resume_str' not in df.columns:
        print(f"Unexpected columns: {df.columns}. Retrying with common names...")
        # Fallback for common column naming variations
        cat_col = 'Category' if 'Category' in df.columns else df.columns[1]
        text_col = 'Resume_str' if 'Resume_str' in df.columns else df.columns[2]
    else:
        cat_col, text_col = 'Category', 'Resume_str'

    # Filter out common English stopwords
    stopwords = set(["and", "the", "with", "for", "from", "that", "this", "project", "work", "experience", "management", "using", "developed", "system", "data", "team", "skills", "knowledge", "design", "professional", "including", "various", "multiple", "provide", "within", "tools", "ability", "excellent", "support", "related", "required", "customer", "business", "services", "environment", "quality", "standard", "technical", "information", "implemented", "managed", "maintained", "performed", "ensured", "created", "increased", "reduced", "improved", "resulted", "achieved", "exceeded", "conducted", "collaborated", "participated", "presented", "prepared", "assisted", "monitored", "scheduled", "coordinated", "resolved", "identified", "determined", "documented", "reported", "reviewed", "verified", "inspected", "tested", "installed", "configured", "updated", "optimized", "integrated", "automated", "trained", "mentored", "supervised", "lead", "leader", "leadership", "manager", "representative", "specialist", "coordinator", "analyst", "developer", "engineer", "designer", "consultant", "administrator", "officer", "assistant", "associate", "intern", "university", "college", "school", "education", "degree", "diploma", "certification", "certified", "language", "english", "hindi", "spanish", "french", "german", "chinese", "japanese", "korean", "arabic", "russian", "portuguese", "italian", "greek", "turkish", "dutch", "swedish", "norwegian", "danish", "finnish", "polish", "hungarian", "czech", "slovak", "romanian", "bulgarian", "ukrainian", "hebrew", "thai", "vietnamese", "indonesian", "malay", "tagalog", "swahili", "zulu", "yoruba", "igbo", "amharic", "somali", "afrikaans", "malagasy", "quechua", "guarani", "aymara", "nahuatl", "maya", "quiche", "aztec", "incas", "mayas", "aztecs", "greek", "latin", "sanskrit", "pali", "persian", "kurdish", "pashto", "balochi", "sindhi", "punjabi", "marathi", "gujarati", "bengali", "oriya", "assamese", "maithili", "dogri", "konkani", "manipuri", "nepali", "santhali", "kashmiri", "urdu", "telugu", "kannada", "malayalam", "tamil", "sinhala", "tibetan", "burmese", "khmer", "lao", "mongolian", "armenian", "georgian", "kazakh", "kyrgyz", "tajik", "turkmen", "uzbek", "azerbaijani", "tatar", "bashkir", "chuvash", "yakut", "tuvan", "altai", "khakas", "buryat", "kalmyk", "chechen", "ingush", "ossetian", "circassian", "kabardian", "dagestani", "avar", "lezgin", "lak", "dargin", "kumyk", "nogai", "tabasaran", "rutul", "tsakhur", "agir", "ubykh", "abkhaz", "abaza", "mingrelian", "laz", "svan", "georgian", "kartvelian", "megrelian", "laz", "svan"])

    category_map = {}
    
    for category in df[cat_col].unique():
        print(f"Generating keywords for {category}...")
        cat_text = " ".join(df[df[cat_col] == category][text_col].astype(str))
        words = clean_text(cat_text)
        
        # Filter stopwords and keep only words > 3 chars
        filtered_words = [w for w in words if w not in stopwords and len(w) > 3]
        
        # Get top 150 keywords for this category
        top_words = [w for w, c in Counter(filtered_words).most_common(150)]
        category_map[category] = top_words

    # Ensure DIR exists
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(category_map, f, indent=2)
        
    print(f"\nSuccess! Keyword map exported to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
