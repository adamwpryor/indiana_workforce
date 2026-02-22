from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="test")
print("Extracting with 'extract' kwarg directly:")
try:
    app.scrape('http://example.com', extract={"prompt": "test"})
    print("Success with direct kwargs")
except Exception as e:
    print(f"Failed direct kwarg: {e}")

print("Extracting with 'params' dictionary:")
try:
    app.scrape('http://example.com', params={"extract": {"prompt": "test"}})
    print("Success with params dict")
except Exception as e:
    print(f"Failed params dict: {e}")
