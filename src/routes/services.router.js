import { Router } from 'express';
import ServiceManager, { ValidationError } from '../managers/ServiceManager.js';

const router = Router();
const manager = new ServiceManager();

const notFound = (res, sid) =>
  res.status(404).json({ status: 'error', error: `No existe un servicio con id ${sid}` });

const handleError = (res, error) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ status: 'error', error: error.message });
  }
  console.error(error);
  return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
};

const parseFilters = (query) => {
  const { category, available } = query;
  const filters = {};

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      throw new ValidationError('El filtro category debe ser un texto no vacío');
    }
    filters.category = category.trim();
  }

  if (available !== undefined) {
    if (available !== 'true' && available !== 'false') {
      throw new ValidationError('El filtro available solo acepta los valores true o false');
    }
    filters.available = available === 'true';
  }

  return filters;
};

router.get('/', async (req, res) => {
  try {
    const filters = parseFilters(req.query);
    const services = await manager.getServices(filters);
    return res.status(200).json({ status: 'success', payload: services });
  } catch (error) {
    return handleError(res, error);
  }
});

router.get('/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await manager.getServiceById(sid);
    if (!service) return notFound(res, sid);
    return res.status(200).json({ status: 'success', payload: service });
  } catch (error) {
    return handleError(res, error);
  }
});

router.post('/', async (req, res) => {
  try {
    const service = await manager.addService(req.body);
    return res.status(201).json({ status: 'success', payload: service });
  } catch (error) {
    return handleError(res, error);
  }
});

router.put('/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await manager.updateService(sid, req.body);
    if (!service) return notFound(res, sid);
    return res.status(200).json({ status: 'success', payload: service });
  } catch (error) {
    return handleError(res, error);
  }
});

router.delete('/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await manager.deleteService(sid);
    if (!service) return notFound(res, sid);
    return res.status(200).json({ status: 'success', payload: service });
  } catch (error) {
    return handleError(res, error);
  }
});

export default router;
