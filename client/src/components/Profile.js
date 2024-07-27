import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";

const ItemType = 'CARD';

function Profile() {
    return (
        <div className="relative flex items-start justify-center h-screen bg-gradient-to-r from-indigo-200 to-yellow-100">
            <DndProvider backend={HTML5Backend}>
                <div className="flex flex-wrap justify-around p-4">
                    <CardColumn title="To Do" id="todo" />
                    <CardColumn title="In Progress" id="inprogress" />
                    <CardColumn title="Done" id="done" />
                    <CardColumn title="In Review" id="inreview" />
                </div>
            </DndProvider>
        </div>
    );
}

function CardColumn({ title, id }) {
    const [cards, setCards] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('title'); // Sorting by title initially

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:4000/tasks', {
                    method: 'GET',
                    credentials: 'include',
                });
                const tasks = await response.json();
                setCards(tasks.filter(task => task.category === id));
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();

        const handleRefresh = (event) => {
            if (event.detail.category === id) {
                fetchTasks();
            }
        };

        window.addEventListener('refreshCards', handleRefresh);

        return () => {
            window.removeEventListener('refreshCards', handleRefresh);
        };
    }, [id]);

    const addCard = () => {
        setShowForm(true);
    };

    const saveCard = async () => {
        const category = id;
        try {
            const response = await fetch('http://localhost:4000/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    category,
                }),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            const newCard = await response.json();
            setCards([...cards, newCard]);
            setShowForm(false);
            setNewTitle('');
            setNewDescription('');
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const moveCard = async (cardId, newCategory) => {
        try {
            const response = await fetch('http://localhost:4000/updateTask', {
                method: 'POST',
                body: JSON.stringify({ taskId: cardId, newCategory }),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });

            if (response.ok) {
                const updatedCard = await response.json();
                setCards((prevCards) => {
                    const updatedCards = prevCards.filter(card => card._id !== cardId);
                    return updatedCards.concat(updatedCard);
                });

                const event = new CustomEvent('refreshCards', { detail: { category: newCategory } });
                window.dispatchEvent(event);
                window.location.reload();
            } else {
                console.error('Failed to update card on the server');
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const deleteCard = async (cardId) => {
        try {
            const response = await fetch(`http://localhost:4000/delete/${cardId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setCards((prevCards) => prevCards.filter(card => card._id !== cardId));
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

    const filteredCards = cards.filter(card =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedCards = filteredCards.sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'date') {
            return new Date(a.date) - new Date(b.date);
        }
        return 0;
    });

    return (
        <div ref={drop} id={id} className="bg-white/20 backdrop-blur-sm shadow-md rounded-lg border border-indigo-300 p-4 m-4 w-64 min-h-[200px] h-fit">
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
            <div className="mt-4 mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border p-2 mb-2 w-full rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="border p-2 w-full rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="title">Sort by Title</option>
                    <option value="date">Sort by Date</option>
                </select>
            </div>
            <div className="mt-4">
                {sortedCards.map((card) => (
                    <DraggableCard key={card._id} card={card} onDelete={deleteCard} />
                ))}
            </div>
        </div>
    );
}

function DraggableCard({ card, onDelete }) {
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
            const response = await fetch(`http://localhost:4000/update/${card._id}`, {
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
        <div ref={drag} className="card bg-gray-100 p-2 mb-2 rounded opacity-80" style={{ opacity: isDragging ? 0.5 : 1 }}>
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
                <div className='flex flex-row ml-auto mr-auto justify-between'>
                    <div>
                        <h3 className="text-lg font-bold">{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                    <div>
                        <button className="text-white py-1 px-1 rounded mr-1" onClick={() => setIsEditing(true)}>
                            <HiOutlinePencilAlt color="green"/>
                        </button>
                        <button className="text-white py-1 px-1 rounded" onClick={handleDelete}>
                            <HiTrash color="red"/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
