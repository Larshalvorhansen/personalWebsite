{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python3
    python3Packages.pandas
    python3Packages.numpy
    python3Packages.scikit-learn
    python3Packages.matplotlib
    python3Packages.seaborn
    python3Packages.plotly
  ];

  shellHook = ''
    echo "PCA Analysis Environment Ready!"
    echo "Available Python packages:"
    echo "  - pandas"
    echo "  - numpy"
    echo "  - scikit-learn"
    echo "  - matplotlib"
    echo "  - seaborn"
    echo "  - plotly"
  '';
}
