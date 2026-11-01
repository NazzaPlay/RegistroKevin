# Unified Data Schema - Pro Edition

## LocalStorage Mapping
- `LS_PILOTO_ACTUAL`
- `LS_LISTA_PILOTOS`
- `LS_PERFILES`
- `LS_RUTAS`

## Logic Structure
The system will transition from fragmented LS keys to a structured JSON object for backups and cloud sync.

### Entities
- **Pilotos**: Array of names.
- **Perfiles**: Mapping of pilot name to personal data and quiz progress.
- **Rutas/Historial**: Nested mapping (Pilot -> Route -> Sessions) including emotional metrics and setups.
- **Estado**: Active pilot context.
