#!/usr/bin/env python3
import os
import sys
import requests
from urllib3.exceptions import ProtocolError

def ping(url):
    try:
        # نرسل طلب GET لكن نستخدم stream=True لنبدأ بالهيدر فقط
        with requests.get(url, stream=True, timeout=5) as r:
            print(f"[{url}] → {r.status_code}")
            # نغلق الاتصال فور استلام الهيدرات
            r.close()
    except (requests.exceptions.RequestException, ProtocolError) as e:
        print(f"[{url}] → error: {e}", file=sys.stderr)

def main():
    urls = os.getenv("URLS", "").split()
    if not urls:
        print("No URLs provided in URLS env var.", file=sys.stderr)
        sys.exit(1)
    for url in urls:
        ping(url)

if __name__ == "__main__":
    main()
