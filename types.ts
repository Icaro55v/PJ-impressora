
export type TaskStatus = 'col-pendente' | 'col-andamento' | 'col-concluido' | 'col-falha';

export type Priority = '1' | '2' | '3';

export interface Task {
  id: string;
  // Requester Fields
  requesterName: string;
  requesterId: string;
  area: string;
  email: string;
  // Piece Fields
  pieceSelect: string;
  pieceOther?: string;
  manufacturerCode?: string;
  equipment?: string;
  // Admin Fields
  fileName?: string;
  priority: Priority;
  material?: string;
  color?: string;
  // Metadata
  column: TaskStatus;
  createdAt: number; // timestamp
  createdBy: string; // user id
}

export type UserRole = 'admin' | 'user';

export interface User {
    uid: string;
    email: string;
    name: string;
    role: UserRole;
}
