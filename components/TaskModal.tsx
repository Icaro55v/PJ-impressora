
import React, { useState, useEffect, useCallback } from 'react';
import { Task, UserRole, Priority } from '../types';
import { AREA_OPTIONS, PIECE_OPTIONS, MATERIAL_OPTIONS } from '../constants';
import { getPrintingSuggestions } from '../services/geminiService';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: Omit<Task, 'createdAt' | 'createdBy' | 'column'> & { id?: string }) => void;
    taskToEdit: Task | null;
    userRole: UserRole;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, userRole }) => {
    const [formData, setFormData] = useState({
        requesterName: '',
        requesterId: '',
        area: '',
        email: '',
        pieceSelect: '',
        pieceOther: '',
        manufacturerCode: '',
        equipment: '',
        fileName: '',
        priority: '2' as Priority,
        material: 'PLA',
        color: '#3B82F6',
    });
    
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                requesterName: taskToEdit.requesterName || '',
                requesterId: taskToEdit.requesterId || '',
                area: taskToEdit.area || '',
                email: taskToEdit.email || '',
                pieceSelect: taskToEdit.pieceSelect || '',
                pieceOther: taskToEdit.pieceOther || '',
                manufacturerCode: taskToEdit.manufacturerCode || '',
                equipment: taskToEdit.equipment || '',
                fileName: taskToEdit.fileName || '',
                priority: taskToEdit.priority || '2',
                material: taskToEdit.material || 'PLA',
                color: taskToEdit.color || '#3B82F6',
            });
        } else {
            // Reset form for new task
             setFormData({
                requesterName: '', requesterId: '', area: '', email: '', pieceSelect: '',
                pieceOther: '', manufacturerCode: '', equipment: '', fileName: '',
                priority: '2', material: 'PLA', color: '#3B82F6',
            });
        }
    }, [taskToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, color: e.target.value}));
    }

    const validateForm = () => {
        if (!formData.requesterName || !formData.requesterId || !formData.area || !formData.email || !formData.pieceSelect) {
            setErrorMessage('Preencha todos os campos de Solicitante e Peça (*).');
            return false;
        }
        if (formData.pieceSelect === 'Outra' && !formData.pieceOther) {
            setErrorMessage('Por favor, descreva a peça no campo "Outra Peça".');
            return false;
        }
        setErrorMessage('');
        return true;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        const dataToSave = { ...formData, id: taskToEdit?.id };
        onSave(dataToSave);
        setIsSubmitting(false);
    };

    const handleAISuggestion = async () => {
        setIsSuggesting(true);
        setErrorMessage('');
        try {
            const pieceName = formData.pieceSelect === 'Outra' ? formData.pieceOther : formData.pieceSelect;
            if (!pieceName) {
                setErrorMessage("Descreva a peça antes de pedir uma sugestão.");
                setIsSuggesting(false);
                return;
            }
            const suggestions = await getPrintingSuggestions(pieceName, formData.equipment);
            if (suggestions) {
                setFormData(prev => ({
                    ...prev,
                    material: suggestions.material || prev.material,
                    color: suggestions.color || prev.color,
                    priority: suggestions.priority || prev.priority,
                }));
            } else {
                 setErrorMessage("Não foi possível obter sugestões da IA.");
            }
        } catch (error) {
            console.error("AI Suggestion Error:", error);
            setErrorMessage("Erro ao comunicar com a IA.");
        } finally {
            setIsSuggesting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 opacity-100">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full transform scale-100 opacity-100 transition-transform duration-300">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-5 border-b border-gray-200">
                        <h4 className="text-2xl font-semibold text-gray-800">{taskToEdit ? 'Editar Pedido' : 'Adicionar Pedido'}</h4>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>

                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                        {/* Requester Fields */}
                        <fieldset className="border border-gray-300 rounded-lg p-4">
                            <legend className="text-sm font-medium text-gray-700 px-2">Solicitante</legend>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-500">*</span></label>
                                        <input type="text" id="requesterName" value={formData.requesterName} onChange={handleChange} placeholder="Nome e Sobrenome" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                    </div>
                                    <div>
                                        <label htmlFor="requesterId" className="block text-sm font-medium text-gray-700 mb-1">Matrícula <span className="text-red-500">*</span></label>
                                        <input type="text" id="requesterId" value={formData.requesterId} onChange={handleChange} placeholder="Sua matrícula" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Área <span className="text-red-500">*</span></label>
                                        <select id="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white" required>
                                            <option value="">Selecione...</option>
                                            {AREA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail para Contato <span className="text-red-500">*</span></label>
                                        <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="seu.email@heineken.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Piece Fields */}
                         <fieldset className="border border-gray-300 rounded-lg p-4">
                            <legend className="text-sm font-medium text-gray-700 px-2">Detalhes da Peça</legend>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="pieceSelect" className="block text-sm font-medium text-gray-700 mb-1">Peça de Interesse <span className="text-red-500">*</span></label>
                                    <select id="pieceSelect" value={formData.pieceSelect} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white" required>
                                        <option value="">Selecione...</option>
                                        {PIECE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                {formData.pieceSelect === 'Outra' && (
                                     <div>
                                        <label htmlFor="pieceOther" className="block text-sm font-medium text-gray-700 mb-1">Outra Peça (descreva) <span className="text-red-500">*</span></label>
                                        <input type="text" id="pieceOther" value={formData.pieceOther} onChange={handleChange} placeholder="Descreva a peça necessária" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="manufacturerCode" className="block text-sm font-medium text-gray-700 mb-1">Código do Fabricante (Original)</label>
                                    <input type="text" id="manufacturerCode" value={formData.manufacturerCode} onChange={handleChange} placeholder="Ex: KHS-100293-B" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">Equipamento onde será usada</label>
                                    <input type="text" id="equipment" value={formData.equipment} onChange={handleChange} placeholder="Ex: Enchedora KHS Linha 2" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                </div>
                            </div>
                        </fieldset>

                        {/* Admin Fields */}
                        {userRole === 'admin' && (
                             <fieldset className="border border-gray-300 rounded-lg p-4">
                                <legend className="text-sm font-medium text-gray-700 px-2">Detalhes da Impressão (Equipa Manufatura)</legend>
                                <div className="space-y-4">
                                    <div className="flex justify-end">
                                         <button type="button" onClick={handleAISuggestion} disabled={isSuggesting} className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors">
                                            {isSuggesting ? (
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" transform="rotate(45 10 10)" /></svg>
                                            )}
                                            <span>Sugerir com IA</span>
                                        </button>
                                    </div>
                                    <div>
                                        <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Arquivo (STL, 3mf, etc.)</label>
                                        <input type="text" id="fileName" value={formData.fileName} onChange={handleChange} placeholder="Ex: peca_final_v2.stl" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                            <select id="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                                                <option value="3">Baixa</option>
                                                <option value="2">Média</option>
                                                <option value="1">Alta</option>
                                            </select>
                                        </div>
                                         <div>
                                            <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                            <select id="material" value={formData.material} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                                                 {MATERIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                                        <div className="flex items-center gap-3">
                                            <input type="color" id="color" value={formData.color} onChange={handleColorChange} className="h-10 w-10 p-0 border border-gray-300 rounded-lg cursor-pointer" />
                                            <input type="text" value={formData.color} onChange={handleColorChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        )}

                        <p className="text-red-500 text-sm h-5">{errorMessage}</p>
                    </div>

                    <div className="flex justify-end items-center space-x-4 p-5 bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-green-300">
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
