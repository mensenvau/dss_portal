# DSS Portal — Odoo 17 (Docker Compose)

This repository runs Odoo 17 with PostgreSQL using Docker Compose and supports custom addons mounted from the workspace.

## Prerequisites

- Docker Desktop (Docker Engine + Compose v2)
- Port `8069` available on your machine (Odoo web UI)

## Quick Start

1. Check `.env` contains valid values for the database connection:
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
2. Start the stack:
   ```sh
   docker compose up -d
   ```
3. Open Odoo: http://localhost:8069
4. On first launch, create a database. If asked for the master password, it uses the value from `data/config/odoo.conf` (`admin_passwd`). You can change it there before starting.

## Configuration

- Compose services: see `docker-compose.yml`
  - `odoo:17` on port `8069`
  - `postgres:15`
- Volumes
  - `./data/config` → `/etc/odoo` (loads `odoo.conf`)
  - `./data/web` → `/var/lib/odoo` (Odoo filestore)
  - `./data/addons` → `/mnt/extra-addons` (your custom addons)
  - `./data/postgresql` → `/var/lib/postgresql/data`
- Odoo config: `data/config/odoo.conf`
  - `addons_path = /mnt/extra-addons,/usr/lib/python3/dist-packages/odoo/addons`
  - `http_port = 8069`
  - `admin_passwd = ...` (master password; you may replace with your own value)

## Custom Addons

Place modules under `data/addons`. Examples included:

- `muk_web_colors` (Odoo 17 compatible)
- `theme_lumen` (website theme)

After adding or changing addons:

1. Restart Odoo or update the app list:
   - In Odoo, enable Developer Mode
   - Apps → Update Apps List → Update
2. If an addon doesn’t appear under the default “Apps” filter:
   - Clear the “Apps” filter (show All), or
   - Set `'application': True` in the module’s `__manifest__.py`

## Common Commands

```sh
# Start/stop
docker compose up -d
docker compose down

# Restart only Odoo
docker compose restart odoo

# Follow logs
docker compose logs -f odoo
docker compose logs -f db
```

## Troubleshooting

- Addons not showing in Apps:
  - Verify `addons_path` includes `/mnt/extra-addons` in `data/config/odoo.conf` (it does by default here)
  - Update Apps List (Developer Mode → Apps → Update Apps List)
  - Clear the “Apps” filter (switch to All)
  - Ensure the module has a valid `__manifest__.py` and `__init__.py`
- Master password unknown:
  - Edit `data/config/odoo.conf` and set `admin_passwd = your_secret`, then restart Odoo.
- Database connection errors:
  - Confirm `POSTGRES_USER` and `POSTGRES_PASSWORD` in `.env` match the Postgres service and `odoo` env
  - Check `docker compose logs -f db`

## Folder Layout

```
data/
  addons/            # Custom addons mounted at /mnt/extra-addons
  config/
    odoo.conf        # Odoo configuration
  postgresql/        # PostgreSQL data directory
  web/               # Odoo filestore
docker-compose.yml   # Services definition (Odoo 17 + Postgres 15)
.env                 # Database credentials for Postgres + Odoo
```

## Notes

- The Odoo image tag is `odoo:17`; the included `muk_web_colors` module targets version `17.0`.
- For themes and website modules (e.g., `theme_lumen`), install the `website` app first.
