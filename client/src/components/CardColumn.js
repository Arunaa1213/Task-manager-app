import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableCard from './DraggableCard';

const ItemType = 'CARD';

function CardColumn({ title, id, cards, onCardClick }) {
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const addCard = () => {
        setShowForm(true);
    };

    const saveCard = async () => {
        const category = id;
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/create`, {
                method: 'POST',
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    category,
                }),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            // const newCard = await response.json();
            setShowForm(false);
            setNewTitle('');
            setNewDescription('');
            const event = new CustomEvent('refreshCards');
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const moveCard = async (cardId, newCategory) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/updateTask`, {
                method: 'POST',
                body: JSON.stringify({ taskId: cardId, newCategory }),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });

            if (response.ok) {
                const event = new CustomEvent('refreshCards');
                window.dispatchEvent(event);
            } else {
                console.error('Failed to update card on the server');
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const deleteCard = async (cardId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/delete/${cardId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                const event = new CustomEvent('refreshCards');
                window.dispatchEvent(event);
            } else {
                console.error('Failed to delete card on the server');
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item) => moveCard(item.id, id),
    });

    return (
        <div ref={drop} id={id} className="bg-white/20 backdrop-blur-sm shadow-md rounded-lg border border-indigo-300 p-4 w-full lg:w-[22%] min-h-[200px] h-fit mb-4 lg:mb-4 mx-0 lg:mx-4 mt-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <button className="bg-indigo-500 border border-indigo-500 text-white py-1 px-2 rounded hover:bg-transparent hover:border-indigo-500 hover:text-black" id={id} onClick={addCard}>
                Add Card
            </button>
            {showForm && (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="border p-2 mb-2 w-full"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="border p-2 mb-2 w-full"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700" onClick={saveCard}>
                        Save
                    </button>
                </div>
            )}
            <div className="mt-4">
                {cards.map((card) => (
                    <DraggableCard 
                        key={card._id} 
                        card={card} 
                        onDelete={deleteCard} 
                        onClick={() => onCardClick(card.title, card.description)}
                    />
                ))}
            </div>
        </div>
    );
}

export default CardColumn;
