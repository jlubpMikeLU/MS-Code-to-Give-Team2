import os
import panphon.featuretable
import pandas as pd
import pkg_resources

def patch_panphon():
    original_read_bases = panphon.featuretable.FeatureTable._read_bases
    
    def new_read_bases(self, fn, weights=None):
        try:
            return original_read_bases(self, fn, weights)
        except UnicodeDecodeError:
            full_path = pkg_resources.resource_filename('panphon', fn)
            with open(full_path, 'r', encoding='utf-8') as f:
                df = pd.read_csv(f, encoding='utf-8')
                # Rename 'ipa' column to 'seg' to match expected format
                df = df.rename(columns={'ipa': 'seg'})
            return df.to_dict('records'), {row['seg']: row for row in df.to_dict('records')}, list(df.columns)
    
    panphon.featuretable.FeatureTable._read_bases = new_read_bases
