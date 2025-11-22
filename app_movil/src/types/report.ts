export type ReportRole = 'Docente' | 'Alumno' | 'Autoridad Educativa' | 'PAAE' | 'Otro';
export type ReportType = 'Violencia' | 'Acoso' | 'Discriminación';

export interface CreateReportDTO {
  role: ReportRole;
  type: ReportType;
  description: string;
  location?: string;
  date?: string;
  witnesses?: string;
  additionalInfo?: string;
}

export interface Report extends CreateReportDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
