from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="test")
methods = [m for m in dir(app) if not m.startswith('_')]
print("METHODS:", methods)
