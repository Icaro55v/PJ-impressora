
import { Task, User, TaskStatus } from './types';

export const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'col-pendente', title: 'Pendente', color: 'red' },
    { id: 'col-andamento', title: 'Em Andamento', color: 'blue' },
    { id: 'col-concluido', title: 'Concluído', color: 'green' },
    { id: 'col-falha', title: 'Falha / Cancelado', color: 'orange' },
];

export const PRIORITY_MAP = {
    '1': { text: 'Alta', bg: 'bg-red-500', border: 'border-red-500' },
    '2': { text: 'Média', bg: 'bg-orange-500', border: 'border-orange-500' },
    '3': { text: 'Baixa', bg: 'bg-blue-500', border: 'border-blue-500' },
};

export const AREA_OPTIONS = ["Envase", "Processos", "Utilidades", "Manutenção", "Qualidade", "Outra"];
export const PIECE_OPTIONS = [
    "Faca para Etiquetadora", "Sapata", "Tampão", "Chave para área de Processos", "Hélice",
    "Tampa do Lava Olhos", "Tampa do Lava Olhos - Linha de Chopp",
    "Pino identificador da abertura da válvula on-off", "Outra"
];
export const MATERIAL_OPTIONS = ["PLA", "PETG", "ABS", "TPU", "Outro"];

export const mockUser: User = {
    uid: 'user123',
    email: 'user.normal@heineken.com',
    name: 'Utilizador Padrão',
    role: 'user',
};

export const mockAdmin: User = {
    uid: 'admin123',
    email: 'admin.manufatura@heineken.com',
    name: 'Admin Manufatura',
    role: 'admin',
};

export const initialTasks: Task[] = [
    {
        id: 'task-1',
        requesterName: 'João Silva',
        requesterId: '10234',
        area: 'Envase',
        email: 'joao.silva@heineken.com',
        pieceSelect: 'Faca para Etiquetadora',
        equipment: 'Enchedora KHS Linha 2',
        priority: '1',
        material: 'PETG',
        color: '#FF0000',
        column: 'col-pendente',
        createdAt: Date.now() - 100000,
        createdBy: 'admin123',
        fileName: 'faca_khs_v3.stl'
    },
    {
        id: 'task-2',
        requesterName: 'Maria Oliveira',
        requesterId: '10567',
        area: 'Processos',
        email: 'maria.oliveira@heineken.com',
        pieceSelect: 'Hélice',
        equipment: 'Tanque de Fermentação T-05',
        priority: '2',
        material: 'PLA',
        color: '#3B82F6',
        column: 'col-andamento',
        createdAt: Date.now() - 200000,
        createdBy: 'admin123',
        fileName: 'helice_t05_final.3mf'
    },
    {
        id: 'task-3',
        requesterName: 'Carlos Pereira',
        requesterId: 'user123',
        area: 'Manutenção',
        email: 'carlos.pereira@heineken.com',
        pieceSelect: 'Sapata',
        equipment: 'Esteira de Saída',
        priority: '2',
        material: 'TPU',
        color: '#4B5563',
        column: 'col-pendente',
        createdAt: Date.now() - 50000,
        createdBy: 'user123',
    },
     {
        id: 'task-4',
        requesterName: 'Ana Costa',
        requesterId: '10991',
        area: 'Qualidade',
        email: 'ana.costa@heineken.com',
        pieceSelect: 'Outra',
        pieceOther: 'Suporte para pipeta de laboratório',
        equipment: 'Bancada de Testes',
        priority: '3',
        material: 'PLA',
        color: '#FFFFFF',
        column: 'col-concluido',
        createdAt: Date.now() - 800000,
        createdBy: 'admin123',
        fileName: 'suporte_pipeta_v1.stl'
    },
];
