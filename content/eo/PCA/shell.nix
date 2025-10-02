{ pkgs ? import <nixpkgs> { } }:

let
  py = pkgs.python312.withPackages (ps:
    with ps; [
      numpy
      pandas
      matplotlib
      seaborn
      scikit-learn
      jupyter
      ipykernel
    ]);
in pkgs.mkShell {
  buildInputs = [ py pkgs.sqlite ];

  shellHook = ''
        echo "--- Entering Nix Shell for Data Analysis Project ---"
        echo "Python: $(python --version)"
        
        python - <<'PY'
    import numpy, pandas, sklearn, matplotlib, seaborn
    print("Loaded: numpy, pandas, scikit-learn, matplotlib, seaborn.")
    PY
        
        echo "The 'sqlite3' command-line tool is also available."
  '';
}
