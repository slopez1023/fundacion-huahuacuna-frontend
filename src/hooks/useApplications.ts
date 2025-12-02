"use client";

import { useState, useCallback, useEffect } from 'react';
import {
  getAllApplications,
  getApplicationsByType,
  getApplicationsByStatus,
  getPendingApplications,
  getRecentPendingApplications,
  getApplicationStatistics,
  searchApplications,
  updateApplicationStatus,
  approveApplication,
  rejectApplication,
  deleteApplication
} from '@/lib/api/applicationApi';
import type {
  ApplicationResponse,
  ApplicationType,
  ApplicationStatus,
  ApplicationStatistics,
  UpdateApplicationStatusDTO
} from '@/types/application';

interface UseApplicationsOptions {
  autoFetch?: boolean;
  type?: ApplicationType;
  status?: ApplicationStatus;
}

export function useApplications(options: UseApplicationsOptions = {}) {
  const { autoFetch = false, type, status } = options;

  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [statistics, setStatistics] = useState<ApplicationStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (type) {
        response = await getApplicationsByType(type);
      } else if (status) {
        response = await getApplicationsByStatus(status);
      } else {
        response = await getAllApplications();
      }

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        throw new Error('Error al cargar las solicitudes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [type, status]);

  const fetchPendingApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPendingApplications();

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        throw new Error('Error al cargar solicitudes pendientes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching pending applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecentApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRecentPendingApplications();

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        throw new Error('Error al cargar solicitudes recientes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching recent applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByName = useCallback(async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchApplications(name);

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        throw new Error('Error al buscar solicitudes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error searching applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await getApplicationStatistics();

      if (response.success && response.data) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  const updateStatus = useCallback(async (
    id: number,
    newStatus: ApplicationStatus,
    comments?: string
  ): Promise<ApplicationResponse | void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data: UpdateApplicationStatusDTO = {
        status: newStatus,
        comments
      };

      const response = await updateApplicationStatus(id, data);

      if (response.success && response.data) {
        setApplications(prev =>
          prev.map(app => (app.id === id ? response.data! : app))
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Error al actualizar estado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approve = useCallback(async (id: number, comments?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await approveApplication(id, comments);

      if (response.success && response.data) {
        setApplications(prev =>
          prev.map(app => (app.id === id ? response.data! : app))
        );
        fetchStatistics();
      } else {
        throw new Error(response.message || 'Error al aprobar solicitud');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatistics]);

  const reject = useCallback(async (id: number, comments: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!comments || comments.trim() === '') {
        throw new Error('Los comentarios son obligatorios al rechazar una solicitud');
      }

      const response = await rejectApplication(id, comments);

      if (response.success && response.data) {
        setApplications(prev =>
          prev.map(app => (app.id === id ? response.data! : app))
        );
        fetchStatistics();
      } else {
        throw new Error(response.message || 'Error al rechazar solicitud');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatistics]);

  const remove = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      fetchStatistics();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatistics]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    fetchApplications();
    fetchStatistics();
  }, [fetchApplications, fetchStatistics]);

  useEffect(() => {
    if (autoFetch) {
      fetchApplications();
      fetchStatistics();
    }
  }, [autoFetch, fetchApplications, fetchStatistics]);

  return {
    applications,
    statistics,
    isLoading,
    error,
    fetchApplications,
    fetchPendingApplications,
    fetchRecentApplications,
    searchByName,
    fetchStatistics,
    updateStatus,
    approve,
    reject,
    remove,
    clearError,
    refresh
  };
}