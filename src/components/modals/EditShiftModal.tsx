import { FaRegTrashAlt, FaTimes } from "react-icons/fa";
import * as Button from "../../components/ui/Button";
import type { EditContext } from "../../types/EditContext";
import type { BeachPost } from "../../types/BeachPost";

export default function EditShiftModal({
  isOpen,
  onClose,
  onSave,
  context,
  posts,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    action: { type: "setDayOff" } | { type: "setWork"; postId: string }
  ) => void;
  context: EditContext | null;
  posts: BeachPost[];
}) {
  if (!isOpen || !context) return null;

  const { lifeguardName, day, preferenceAPostId, reasoning } = context;
  const formattedDate = new Date(day + "T00:00:00").toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    }
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Editar Diária</h2>
          <Button.Root>
            <Button.ButtonComponent
              variant="secondary"
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <Button.Icon icon={FaTimes} />
            </Button.ButtonComponent>
          </Button.Root>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="font-semibold text-gray-800">{lifeguardName}</p>
            <p className="text-sm text-gray-600">{formattedDate}</p>
          </div>

          {reasoning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm">
              <p className="font-bold text-blue-800">
                Status Original: {reasoning.status}
              </p>
              <p className="text-blue-700 mt-1">{reasoning.details}</p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
              Alocar em Posto:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {posts
                .sort((a, b) => a.order - b.order)
                .map((post) => (
                  <Button.Root key={post.id}>
                    <Button.ButtonComponent
                      variant={
                        post.id === preferenceAPostId
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => onSave({ type: "setWork", postId: post.id })}
                    >
                      {post.name}
                    </Button.ButtonComponent>
                  </Button.Root>
                ))}
            </div>
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2 pt-4">
              Ações:
            </h3>
            <Button.Root>
              <Button.ButtonComponent
                variant="danger"
                onClick={() => onSave({ type: "setDayOff" })}
                className="w-full"
              >
                <Button.Icon icon={FaRegTrashAlt} />
                Definir como Folga
              </Button.ButtonComponent>
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
