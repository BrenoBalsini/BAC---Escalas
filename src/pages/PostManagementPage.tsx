import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { BeachPost } from '../types/BeachPost';
import * as Button from '../components/ui/Button';
import { AddPostModal } from '../components/modals/AddPostModal';
import { FaTrash, FaPencilAlt, FaPlus } from 'react-icons/fa';

export default function PostManagementPage() {
  const [posts, setPosts] = useLocalStorage<BeachPost[]>('posts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para guardar o posto que está sendo editado
  const [editingPost, setEditingPost] = useState<BeachPost | null>(null);

  const handleOpenAddModal = () => {
    setEditingPost(null); // Garante que não está em modo de edição
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (post: BeachPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleSavePost = (postData: Omit<BeachPost, 'id'>) => {
    if (editingPost) {
      // Lógica de Edição
      const updatedPosts = posts.map(p => 
        p.id === editingPost.id ? { ...p, ...postData } : p
      );
      setPosts(updatedPosts);
    } else {
      // Lógica de Adição
      const newPost: BeachPost = {
        ...postData,
        id: crypto.randomUUID(),
      };
      setPosts(prev => [...prev, newPost]);
    }
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este posto? Isso pode afetar escalas salvas.')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };
  
  const sortedPosts = [...posts].sort((a, b) => a.order - b.order);

  return (
    <>
      <AddPostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePost}
        editablePost={editingPost}
      />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Postos</h1>
           <Button.Root>
                <Button.ButtonComponent onClick={handleOpenAddModal}>
                    <Button.Icon icon={FaPlus}/>
                    Adicionar Posto
                </Button.ButtonComponent>
           </Button.Root>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Posto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => handleOpenEditModal(post)} className="text-blue-600 hover:text-blue-900">
                      <FaPencilAlt />
                    </button>
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="text-center py-8 text-gray-500">Nenhum posto cadastrado.</p>
          )}
        </div>
      </div>
    </>
  );
}