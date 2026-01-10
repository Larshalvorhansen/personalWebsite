{
  description = "Python datascience utviklingsmiljø";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        pythonEnv = pkgs.python311.withPackages (ps:
          with ps; [
            # Core datascience
            numpy
            pandas
            scipy
            scikit-learn

            # Visualisering
            matplotlib
            seaborn
            plotly

            # Jupyter
            jupyter
            ipython
            notebook

            # Machine learning
            tensorflow
            pytorch
            xgboost
            lightgbm

            # Data processing
            polars
            pyarrow

            # Stats og analyse
            statsmodels

            # Utilities
            requests
            beautifulsoup4
            openpyxl
          ]);
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pythonEnv
            pkgs.ruff # Python linter/formatter
          ];

          shellHook = ''
            echo "🐍 Python datascience miljø aktivert!"
            echo "Tilgjengelige verktøy: jupyter, python, ipython"
            python --version
          '';
        };
      });
}
