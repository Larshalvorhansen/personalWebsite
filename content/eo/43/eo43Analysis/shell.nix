{ pkgs ? import <nixpkgs> { } }:

let
  # Create a Python environment with all our dependencies
  pythonEnv = pkgs.python311.withPackages (ps:
    with ps; [
      requests
      pandas
      numpy
      beautifulsoup4
      lxml

      # Development tools
      ipython
      black
      pylint

      # Note: yfinance is not in nixpkgs, so we'll install it via pip in shellHook
      # but we include all its dependencies that ARE in nixpkgs
      pytz
      multitasking
      frozendict
    ]);

in pkgs.mkShell {
  name = "financial-data-collector-env";

  buildInputs = with pkgs; [
    pythonEnv

    # Database tools
    sqlite
    sqlitebrowser # GUI for viewing SQLite databases

    # Useful utilities
    curl
    jq # For inspecting JSON API responses
  ];

  shellHook = ''
    echo "================================================"
    echo "Financial Data Collector Environment"
    echo "================================================"
    echo ""
    echo "Python version: $(python --version)"
    echo "SQLite version: $(sqlite3 --version)"
    echo ""

    # Create a virtual environment only for packages not in nixpkgs (like yfinance)
    if [ ! -d .venv ]; then
      echo "Creating virtual environment for additional packages..."
      python -m venv .venv
    fi

    # Activate virtual environment
    source .venv/bin/activate

    # Install yfinance (not available in nixpkgs)
    if ! python -c "import yfinance" 2>/dev/null; then
      echo "Installing yfinance..."
      pip install --quiet yfinance
    fi

    echo ""
    echo "✓ All dependencies ready!"
    echo ""
    echo "Available commands:"
    echo "  python financial_data_collector.py --help"
    echo "  sqlite3 <database.db>"
    echo "  sqlitebrowser <database.db>  # GUI database viewer"
    echo "  ipython                       # Interactive Python shell"
    echo ""
    echo "Example usage:"
    echo "  # Test with a single company"
    echo "  python financial_data_collector.py --db companies.db --test 123456789"
    echo ""
    echo "  # Process first 10 companies"
    echo "  python financial_data_collector.py --db companies.db --limit 10"
    echo ""
    echo "  # Process all companies with 1 second delay"
    echo "  python financial_data_collector.py --db companies.db --delay 1.0"
    echo ""
    echo "  # Show statistics"
    echo "  python financial_data_collector.py --db companies.db --stats"
    echo ""
    echo "  # Test API directly with curl"
    echo "  curl https://data.brreg.no/enhetsregisteret/api/enheter/123456789 | jq"
    echo ""
    echo "================================================"
    echo "Environment ready! 🚀"
    echo "================================================"
  '';

  # Environment variables
  PYTHONPATH = ".";

  # Disable pip version check to reduce noise
  PIP_DISABLE_PIP_VERSION_CHECK = "1";

  # Make Python output unbuffered for better logging
  PYTHONUNBUFFERED = "1";
}
