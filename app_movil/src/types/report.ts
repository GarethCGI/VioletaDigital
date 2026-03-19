export type ReportRole = 'Docente' | 'Alumno' | 'Autoridad Educativa' | 'PAAE' | 'Otro';
export type ReportType = 'Violencia' | 'Acoso' | 'Discriminación';
export type QuestionnaireInformantRole = 'VICTIM' | 'WITNESS' | 'PREFER_NOT_TO_SAY' | 'OTHER';
export type QuestionnaireFrequency = 'NEVER' | 'SOMETIMES' | 'OFTEN' | 'ALMOST_ALWAYS';
export type QuestionnaireRiskLevel = 'YELLOW' | 'ORANGE' | 'RED';

export interface QuestionnaireData {
  level0: {
    informantRole: QuestionnaireInformantRole;
  };
  level1: {
    hurtfulJokes: QuestionnaireFrequency;
    jealousyControlHumiliation: QuestionnaireFrequency;
    exclusion: QuestionnaireFrequency;
    physicalAggression: QuestionnaireFrequency;
    digitalHarassment: QuestionnaireFrequency;
  };
  level3?: {
    damageAfterViolence?: 'IMMEDIATE' | 'AFTER_SOME' | 'MOST_EPISODES' | 'PRE_EXISTING';
    wantsAnonymousRecord?: boolean;
    wantsToIdentifyRelatedPerson?: boolean;
    wantsAnonymousContact?: boolean;
    preferredInitialContact?: 'IN_APP' | 'EMAIL' | 'PHONE' | 'NO_CONTACT';
    preferredSupport?: 'PSYCHOLOGICAL' | 'ACADEMIC' | 'LEGAL' | 'SOCIAL';
  };
}

export interface CreateReportDTO {
  role: ReportRole;
  type: ReportType;
  description: string;
  location?: string;
  date?: string;
  witnesses?: string;
  additionalInfo?: string;
  questionnaireData?: QuestionnaireData;
  riskLevel?: QuestionnaireRiskLevel;
}

export interface Report extends CreateReportDTO {
  id: string;
  informantRole?: QuestionnaireInformantRole;
  hasQuestionnaire?: boolean;
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
