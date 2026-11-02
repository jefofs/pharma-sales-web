import api from './api';

export interface VisitResponse {
  id: number;
  doctorId: number;
  doctorName?: string;
  userId: number;
  presentedMaterial?: string;
  date: string;
  time: string;
  observation?: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA';
}

export interface CreateVisitRequest {
  doctorId: number;
  userId: number;
  date: string;
  time: string;
  presentedMaterial?: string;
  observation?: string;
  observations?: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA' | 'REAGENDADA';
}

class VisitService {
  async getAllVisits(): Promise<VisitResponse[]> {
    const response = await api.get('/visits');
    return response.data;
  }

  async createVisit(data: CreateVisitRequest): Promise<VisitResponse> {
    // Sanitização e garantia de tipos para o Spring Boot
    const payload = {
      doctorId: Number(data.doctorId),
      userId: Number(data.userId) || 1,
      date: data.date,
      time: data.time.length === 5 ? `${data.time}:00` : data.time,
      observation: data.observation || data.observations || '',
      presentedMaterial: data.presentedMaterial || '',
      status: data.status || 'AGENDADA',
    };

    const response = await api.post('/visits', payload);
    return response.data;
  }

  async updateVisit(
    id: number | string,
    data: CreateVisitRequest
  ): Promise<VisitResponse> {
    // Se o ID for temporário (offline) ou inválido, impede a chamada ao backend
    if (!id || String(id).startsWith('temp') || id === 'undefined') {
      throw new Error('Visita offline ainda não possui ID no servidor.');
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new Error(`ID de visita inválido: ${id}`);
    }

    const payload = {
      doctorId: Number(data.doctorId),
      userId: Number(data.userId) || 1,
      date: data.date,
      time: data.time.length === 5 ? `${data.time}:00` : data.time,
      observation: data.observation || data.observations || '',
      presentedMaterial: data.presentedMaterial || '',
      status: data.status || 'AGENDADA',
    };

    const response = await api.put(`/visits/${numericId}`, payload);
    return response.data;
  }

  async deleteVisit(id: number | string): Promise<void> {
    // Se for ID temporário de visita offline, apenas ignora a requisição remota
    if (!id || String(id).startsWith('temp') || id === 'undefined') {
      return;
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return;
    }

    await api.delete(`/visits/${numericId}`);
  }
}

export default new VisitService();