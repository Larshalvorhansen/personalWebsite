# PCA Dummy Project (Python + MySQL)

## Setup
1) Copy `.env.example` to `.env` and edit credentials.
2) Enter Nix shell:
   - Flakes: `nix develop`
   - Legacy: `nix-shell`
3) Initialize DB:
   ```bash
   mysql -u "$DB_USER" ${DB_PASS:+-p"$DB_PASS"} -h "$DB_HOST" -P "$DB_PORT" < db/schema.sql
