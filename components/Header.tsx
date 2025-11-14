import React from 'react';
import { User } from '../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onAddTask: () => void;
    sortMethod: 'createdAt' | 'priority';
    onSortChange: (method: 'createdAt' | 'priority') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onAddTask, sortMethod, onSortChange }) => {
    return (
        <header className="bg-green-800 text-white shadow-lg sticky top-0 z-40">
            <div className="container mx-auto max-w-full px-4 md:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3DP 11 3H11.01M12 21V11.828M18 8V4m0 4H6M4 12v8a1 1 0 001 1h14a1 1 0 001-1v-8M4 12H2M20 12h2M6 4h12M6 8v4m12-4v4" />
                    </svg>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold">Gestor de Fila de Impressão 3D</h1>
                        <p className="text-sm text-gray-200 font-light">Cervejaria Heineken - Manufatura</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {user.role === 'admin' && (
                        <div className="hidden md:flex items-center space-x-2">
                            <label htmlFor="header-sort-select" className="text-sm font-medium sr-only">Ordenar por</label>
                            <select
                                id="header-sort-select"
                                value={sortMethod}
                                onChange={(e) => onSortChange(e.target.value as 'createdAt' | 'priority')}
                                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-sm border border-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            >
                                <option value="createdAt">Data de Adição</option>
                                <option value="priority">Prioridade</option>
                            </select>
                        </div>
                    )}
                    <button onClick={onAddTask} className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold transition-colors">
                        Adicionar Pedido
                    </button>
                    <button onClick={onLogout} className="bg-green-500 text-white px-3 py-2 rounded-lg border border-green-600 text-sm font-medium hover:bg-red-600 hover:border-red-700 transition-colors">
                        Sair
                    </button>
                </div>
            </div>
             <div className="py-2 px-6 bg-green-900 text-green-200 text-sm text-center sticky top-[80px] z-30">
                <span>Conectado como: {user.name} (<strong>{user.role.toUpperCase()}</strong>)</span>
            </div>
        </header>
    );
};

export default Header;