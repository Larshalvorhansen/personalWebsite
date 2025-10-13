#!/usr/bin/env bash
set -euo pipefail

REPO="pca_dummy"
HERE="$(pwd)"

# Helper: write a file with heredoc, creating parent dir
write() {
  local path="$1"; shift
  mkdir -p "$(dirname "$path")"
  cat > "$path" <<'EOF'
'"$@"'
EOF
}

# Guard against stomping an existing directory
if [[ -e "$REPO" ]]; then
  echo "Folder '$REPO' already exists. Move it or rename it. Not playing Tetris with your files."
  exit 1
fi

echo "Creating project at $HERE/$REPO"
mkdir -p "$REPO"/{db,src}

############################
# Project files
############################

# .gitignore (light housekeeping)
cat > "$REPO/.gitignore" <<'EOF'
.venv/
__pycache__/
*.pyc
.env
pca_scatter.png
EOF

# requirements.txt
cat > "$REPO/requirements.txt" <<'EOF'
numpy==2.0.2
pandas==2.2.2
scikit-learn==1.5.1
SQLAlchemy==2.0.35
PyMySQL==1.1.1
python-dotenv==1.0.1
matplotlib==3.9.2
EOF

# .env.example
cat > "$REPO/.env.example" <<'EOF'
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=pca_demo
EOF

# README.md
cat > "$REPO/README.md" <<'EOF'
# PCA Dummy Project (Python + MySQL)

## Setup
1) Copy `.env.example` to `.env` and edit credentials.
2) Enter Nix shell:
   - Flakes: `nix develop`
   - Legacy: `nix-shell`
3) Initialize DB:
   ```bash
   mysql -u "$DB_USER" ${DB_PASS:+-p"$DB_PASS"} -h "$DB_HOST" -P "$DB_PORT" < db/schema.sql
