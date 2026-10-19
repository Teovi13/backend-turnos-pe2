# Backend de Turnos y Reservas - Pre-entrega 2

API REST con Express (ESM) para el recurso `services`. Las rutas están en `services.router.js` (`express.Router()`) y delegan la lógica en `ServiceManager`, que guarda los datos en `src/data/services.json`.

## Instalación y ejecución

```bash
git clone https://github.com/Teovi13/backend-turnos-pe2.git
cd backend-turnos-pe2
npm install
cp .env.example .env
npm start
```

El servidor queda en `http://localhost:8080`.

## Variables de entorno

| Variable   | Ejemplo       |
| ---------- | ------------- |
| `PORT`     | `8080`        |
| `NODE_ENV` | `development` |

## Endpoints

| Método | Ruta                 | Descripción                                         | Códigos       |
| ------ | -------------------- | --------------------------------------------------- | ------------- |
| GET    | `/api/services`      | Lista servicios. Filtros: `?category=`, `?available=` | 200, 400      |
| GET    | `/api/services/:sid` | Obtiene un servicio                                 | 200, 404      |
| POST   | `/api/services`      | Crea un servicio (id generado automáticamente)      | 201, 400      |
| PUT    | `/api/services/:sid` | Actualiza los campos enviados (el id no cambia)     | 200, 400, 404 |
| DELETE | `/api/services/:sid` | Elimina un servicio                                 | 200, 404      |

Campos de un servicio: `name`, `description`, `duration`, `price`, `category`, `available` (todos obligatorios al crear).

Las respuestas tienen el formato `{ "status": "success", "payload": ... }` o `{ "status": "error", "error": "..." }`.

## Cómo probar

```bash
curl http://localhost:8080/api/services
curl "http://localhost:8080/api/services?category=salud&available=true"
curl http://localhost:8080/api/services/4971a0ab-8dcf-42a8-a230-38db8e38e674

curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{"name":"Sesión de fisioterapia","description":"Rehabilitación","duration":60,"price":15000,"category":"salud","available":true}'

curl -X PUT http://localhost:8080/api/services/<id> \
  -H "Content-Type: application/json" \
  -d '{"price":13500}'

curl -X DELETE http://localhost:8080/api/services/<id>
```

También se puede probar con Postman o Thunder Client.
