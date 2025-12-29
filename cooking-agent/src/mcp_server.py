#!/usr/bin/env python3
from mcp.server import Server
from mcp.server import Tool
import subprocess

server = Server("uv-server")

@Tool
def uv_version():
    """Return uv version."""
    return subprocess.check_output(["uv", "--version"]).decode()

@tool
def uv_install(package: str):
    """Install a Python package using uv."""
    return subprocess.check_output(["uv", "pip", "install", package]).decode()

@tool
def uv_sync():
    """Sync dependencies."""
    return subprocess.check_output(["uv", "sync"]).decode()

if __name__ == "__main__":
    server.run()
