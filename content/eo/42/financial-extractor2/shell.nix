{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Python
    python311
    python311Packages.pip
    python311Packages.setuptools

    # PDF processing
    python311Packages.pymupdf
    python311Packages.pdfplumber

    # LLM integration
    python311Packages.requests

    # Stock price fetching
    python311Packages.yfinance

    # Data processing
    python311Packages.pandas
    python311Packages.numpy

    # Utilities
    python311Packages.python-dateutil
    python311Packages.tqdm
    python311Packages.watchdog

    # Development/Testing
    python311Packages.pytest
    python311Packages.pytest-cov
    python311Packages.black
    python311Packages.flake8

    # Database tools (optional, for browsing SQLite)
    sqlite

    # Ollama (if you want it in the shell)
    # ollama
  ];

  shellHook = ''
    echo "🚀 Financial Data Extractor Environment"
    echo "========================================"
    echo ""
    echo "Python: $(python --version)"
    echo "SQLite: $(sqlite3 --version)"
    echo ""
    echo "📁 Project directories will be auto-created on first run"
    echo "🤖 Make sure Ollama is running: ollama serve"
    echo ""
    echo "Ready to go! 🎯"
    echo ""

    # Auto-create project structure if it doesn't exist
    mkdir -p config database utils logs data/{input,processed,failed,temp}
    touch config/__init__.py database/__init__.py utils/__init__.py

    # Set PYTHONPATH to current directory
    export PYTHONPATH="$PWD:$PYTHONPATH"
  '';
}
