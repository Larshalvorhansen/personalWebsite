{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python311
    python311Packages.requests
    python311Packages.beautifulsoup4
    python311Packages.lxml
    sqlite
  ];

  shellHook = ''
    echo "🚀 Norwegian Company Scraper Environment"
    echo "========================================"
    echo ""
    echo "Python version: $(python --version)"
    echo "SQLite version: $(sqlite3 --version)"
    echo ""
    echo "Available commands:"
    echo "  python scraper.py    - Run the scraper"
    echo "  sqlite3 norwegian_companies.db - Query the database"
    echo ""
    echo "Installed packages:"
    echo "  ✓ requests"
    echo "  ✓ beautifulsoup4"
    echo "  ✓ lxml"
    echo "  ✓ sqlite3"
    echo ""
    echo "Ready to scrape! 🔍"
    echo ""
  '';
}
