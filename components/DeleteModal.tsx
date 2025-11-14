
import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 opacity-100">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full transform scale-100 opacity-100 transition-transform duration-300">
                <h4 className="text-xl font-semibold mb-4">Confirmar exclusão</h4>
                <p className="text-gray-600 mb-6">Tem certeza de que deseja excluir este pedido?</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Excluir</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
