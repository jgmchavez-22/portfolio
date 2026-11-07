#!/usr/bin/env python3
"""
Jan Gabriel Chavez - Local Portfolio Preview Server
---------------------------------------------------
Runs a zero-dependency local HTTP server to preview the portfolio
website and public resume.

Usage:
    python3 start.py
    # Then open http://localhost:8080 in your browser
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent aggressive browser caching during local development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    print()
    print("  =======================================================")
    print("    Jan Gabriel Chavez — Portfolio & Systems Showcase   ")
    print("  =======================================================")
    print(f"  Local URL:    http://localhost:{PORT}/")
    print(f"  Resume URL:   http://localhost:{PORT}/resume.html")
    print(f"  Root Folder:  {DIRECTORY}")
    print()
    print("  Press Ctrl+C to stop the server.")
    print("  =======================================================")
    print()

    # Allow port reuse immediately
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
        sys.exit(0)
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n  Port {PORT} is currently in use. Please close existing instances or run on another port.")
        else:
            raise

if __name__ == "__main__":
    main()
