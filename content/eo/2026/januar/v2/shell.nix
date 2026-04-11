# shell.nix
{
  description =
    "G7 Simulation Series - Agent-Based Model Development Environment";

  inputs = { nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; };

  outputs = { self, nixpkgs }:
    let
      system =
        "x86_64-linux"; # Change to "aarch64-darwin" for Apple Silicon Mac
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.${system}.default = pkgs.mkShell {
        name = "g7-simulation-shell";

        buildInputs = with pkgs; [
          # Python environment
          python312
          python312Packages.pip
          python312Packages.virtualenv

          # Development tools
          uv # Fast Python package manager (recommended)
          ruff # Fast Python linter & formatter
          pyright # Python type checker
          black # Alternative formatter (optional)

          # Optional: for data analysis / visualization later
          python312Packages.numpy
          python312Packages.pandas
          python312Packages.matplotlib
          python312Packages.seaborn

          # Git and utilities
          git
          gh # GitHub CLI
        ];

        shellHook = ''
          echo "🚀 G7 Crystal Ball Simulation Development Shell"
          echo "   Phase: January 2026 - Project Foundation"
          echo "   Target: G7 Summit June 2026"
          echo ""

          # Create virtual environment if it doesn't exist
          if [ ! -d ".venv" ]; then
            echo "Creating Python virtual environment..."
            python -m venv .venv
          fi

          # Activate virtual environment
          source .venv/bin/activate

          # Upgrade pip and install uv for faster installs
          pip install --upgrade pip uv

          echo "✅ Virtual environment activated (.venv)"
          echo "📦 Use 'uv pip install -r requirements.txt' or 'uv pip install <package>'"
          echo ""
          echo "Available commands:"
          echo "   python g7_simulation_january.py     # Run January phase"
          echo "   uv pip install -e .                 # If you add a pyproject.toml later"
          echo ""
        '';
      };
    };
}
