import React, { useState } from 'react';
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { useDrag } from 'react-dnd';

const ItemType = 'CARD';

export default function DraggableCard({ card, onDelete, onClick }) {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: card._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [editDescription, setEditDescription] = useState(card.description);

    const handleEdit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/update/${card._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                }),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });

            if (response.ok) {
                const updatedCard = await response.json();
                setEditTitle(updatedCard.title);
                setEditDescription(updatedCard.description);
                setIsEditing(false);
                window.location.reload();
            } else {
                console.error('Failed to update card on the server');
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const handleDelete = () => {
        onDelete(card._id);
    };

    return (
        <div ref={drag} className="card bg-gray-100 mb-2 rounded opacity-80" style={{ opacity: isDragging ? 0.5 : 1 }}>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        className="border p-1 mb-2 w-full"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        className="border p-1 mb-2 w-full"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div className='flex flex-row justify-between'>
                        <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700" onClick={handleEdit}>
                            Save
                        </button>
                        <button className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-700" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col ml-auto mr-auto justify-between p-4 rounded-lg bg-indigo-200'>
                    <div>
                        <h3 className="text-lg font-bold">{card.title}</h3>
                        <p>{card.description}</p>
                        <p className="text-xs text-gray-500 mt-8">Created at: {new Date(card.createdAt).toLocaleString()}</p>
                    </div>
                    <div className='flex flex-row ml-auto mt-4'>
                        <button className="text-white py-1 px-1 rounded mr-1 flex flex-row mr-2" onClick={() => setIsEditing(true)}>
                            <HiOutlinePencilAlt color="green"/>
                        </button>
                        <button className="text-white py-1 px-1 rounded flex flex-row mr-4" onClick={handleDelete}>
                            <HiTrash color="red"/>
                        </button>
                        <button 
                            className='text-white py-1 px-1 rounded bg-blue-500 text-xs'
                            onClick={onClick}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
