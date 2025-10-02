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
  buildInputs = [ py ];

  # Cute little sanity ping so you know it worked
  shellHook = ''
        echo "Python: $(python --version)"
        python - <<'PY'
    import numpy, pandas, sklearn, matplotlib, seaborn
    print("Loaded: numpy, pandas, scikit-learn, matplotlib, seaborn")
    PY
  '';
}
