import React, { useState, useEffect } from 'react';
import type { BeachPost } from '../../types/BeachPost';
import * as Button from '../ui/Button';
import { FaTimes } from 'react-icons/fa';

type AddPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: Omit<BeachPost, 'id'>) => void;
  
  editablePost?: BeachPost | null; 
};

export const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose, onSave, editablePost }) => {
  const [name, setName] = useState('');
  const [order, setOrder] = useState(1);

  
  useEffect(() => {
    if (editablePost) {
      setName(editablePost.name);
      setOrder(editablePost.order);
    } else {
      
      setName('');
      setOrder(1);
    }
  }, [editablePost, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('O nome do posto é obrigatório.');
      return;
    }
    onSave({ name, order });
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {editablePost ? 'Editar Posto' : 'Adicionar Novo Posto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="post-name" className="block text-sm font-medium text-gray-700">Nome do Posto</label>
              <input
                type="text"
                id="post-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="post-order" className="block text-sm font-medium text-gray-700">Ordem</label>
              <input
                type="number"
                id="post-order"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg gap-2">
            <Button.Root>
                <Button.ButtonComponent variant="secondary" onClick={onClose} type="button">
                    Cancelar
                </Button.ButtonComponent>
            </Button.Root>
            <Button.Root>
                <Button.ButtonComponent type="submit">
                    Salvar
                </Button.ButtonComponent>
            </Button.Root>
          </div>
        </form>
      </div>
    </div>
  );
};