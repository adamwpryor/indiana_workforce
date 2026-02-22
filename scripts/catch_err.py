import sys
import traceback

sys.path.append('scripts')

try:
    import data_crawler
except Exception as e:
    with open('scripts/error_out.txt', 'w') as f:
        f.write(traceback.format_exc())
