import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const DEFAULT_PATH = fileURLToPath(new URL('../data/services.json', import.meta.url));

const FIELDS = ['name', 'description', 'duration', 'price', 'category', 'available'];

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const isMissing = (value) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

const pickFields = (data) =>
  Object.fromEntries(
    FIELDS.filter((field) => data[field] !== undefined).map((field) => [field, data[field]])
  );

export default class ServiceManager {
  constructor(filePath = DEFAULT_PATH) {
    this.filePath = filePath;
  }

  async #readServices() {
    let content;

    try {
      content = await readFile(this.filePath, 'utf-8');
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }

    if (content.trim() === '') return [];

    let services;

    try {
      services = JSON.parse(content);
    } catch {
      services = null;
    }

    if (!Array.isArray(services)) {
      throw new Error(`El archivo ${this.filePath} debe contener un array JSON válido`);
    }

    return services;
  }

  async #writeServices(services) {
    await writeFile(this.filePath, `${JSON.stringify(services, null, 2)}\n`, 'utf-8');
  }

  async getServices(filters = {}) {
    const { category, available } = filters;
    const services = await this.#readServices();

    return services.filter((service) => {
      if (category !== undefined && String(service.category).toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (available !== undefined && service.available !== available) {
        return false;
      }
      return true;
    });
  }

  async getServiceById(id) {
    const services = await this.#readServices();
    return services.find((service) => service.id === id) ?? null;
  }

  async addService(serviceData) {
    const data = pickFields(serviceData ?? {});
    const missing = FIELDS.filter((field) => isMissing(data[field]));

    if (missing.length > 0) {
      throw new ValidationError(`Servicio incompleto. Faltan los campos: ${missing.join(', ')}`);
    }

    const newService = { id: randomUUID(), ...data };
    const services = await this.#readServices();

    services.push(newService);
    await this.#writeServices(services);

    return newService;
  }

  async updateService(id, updatedData) {
    const services = await this.#readServices();
    const index = services.findIndex((service) => service.id === id);

    if (index === -1) return null;

    const changes = pickFields(updatedData ?? {});
    const fields = Object.keys(changes);

    if (fields.length === 0) {
      throw new ValidationError(`No se enviaron campos para actualizar. Campos permitidos: ${FIELDS.join(', ')}`);
    }

    const empty = fields.filter((field) => isMissing(changes[field]));

    if (empty.length > 0) {
      throw new ValidationError(`Los campos no pueden estar vacíos: ${empty.join(', ')}`);
    }

    services[index] = { ...services[index], ...changes };
    await this.#writeServices(services);

    return services[index];
  }

  async deleteService(id) {
    const services = await this.#readServices();
    const index = services.findIndex((service) => service.id === id);

    if (index === -1) return null;

    const [deleted] = services.splice(index, 1);
    await this.#writeServices(services);

    return deleted;
  }
}
