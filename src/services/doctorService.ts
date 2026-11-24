import api from './api';
import { Doctor } from '@/types/doctor';

export interface DoctorOption {
  id: number;
  name: string;
  specialty?: string;
  clinic?: string;
}

class DoctorService {
  async getAllDoctors(search?: string): Promise<Doctor[]> {
    const response = await api.get<Doctor[]>('/doctors', {
      params: search ? { search } : undefined,
    });
    return Array.isArray(response.data) ? response.data : [];
  }
}

export default new DoctorService();