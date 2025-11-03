{ pkgs ? import <nixpkgs> { } }:

let
  pythonEnv = pkgs.python311.withPackages (ps:
    with ps; [
      requests
      pandas
      numpy
      beautifulsoup4
      lxml
      scikitlearn

      ipython
      black
      pylint

      pytz
      multitasking
      frozendict
    ]);

in pkgs.mkShell {
  name = "financial-data-collector-env";
  buildInputs = with pkgs; [ pythonEnv sqlite sqlitebrowser curl jq ];

  shellHook = ''
    echo "Setting up environment..."

    [ ! -d .venv ] && python -m venv .venv
    source .venv/bin/activate

    pip install --quiet --upgrade pip
    pip install --quiet yfinance plotly

    echo "Ready! Use: python financial_data_collector.py --help"
  '';

  PYTHONPATH = ".";
  PYTHONUNBUFFERED = "1";
}
