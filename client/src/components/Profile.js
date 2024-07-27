import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CardColumn from './CardColumn';
import Modal from './Modal'; // Import the Modal component

function Profile() {
    const [cards, setCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const tasks = await response.json();
                setCards(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();

        const handleRefresh = () => {
            fetchTasks();
        };

        window.addEventListener('refreshCards', handleRefresh);

        return () => {
            window.removeEventListener('refreshCards', handleRefresh);
        };
    }, []);

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

    const openModal = (title, description) => {
        setModalTitle(title);
        setModalDescription(description);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalTitle('');
        setModalDescription('');
    };

    return (
        <div className="relative flex items-start justify-center bg-gradient-to-r from-indigo-200 to-yellow-100">
            <DndProvider backend={HTML5Backend}>
                <div className="flex flex-col items-center p-12 w-full">
                    <div className="search-sort-controls mb-4 flex flex-col lg:flex-row w-full justify-between pt-4 px-4 bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border p-2 mb-4 w-full lg:w-1/5 rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="border mb-4 w-full lg:w-1/5 rounded-md"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="title">Sort by Title</option>
                            <option value="date">Sort by Date</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap justify-between w-full bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg">
                        <CardColumn 
                            title="To Do" 
                            id="todo" 
                            cards={sortedCards.filter(card => card.category === 'todo')} 
                            onCardClick={openModal}
                        />
                        <CardColumn 
                            title="In Progress" 
                            id="inprogress" 
                            cards={sortedCards.filter(card => card.category === 'inprogress')} 
                            onCardClick={openModal}
                        />
                        <CardColumn 
                            title="Done" 
                            id="done" 
                            cards={sortedCards.filter(card => card.category === 'done')} 
                            onCardClick={openModal}
                        />
                        <CardColumn 
                            title="In Review" 
                            id="inreview" 
                            cards={sortedCards.filter(card => card.category === 'inreview')} 
                            onCardClick={openModal}
                        />
                    </div>
                </div>
            </DndProvider>
            <Modal 
                show={isModalOpen} 
                onClose={closeModal} 
                title={modalTitle} 
                description={modalDescription} 
            />
        </div>
    );
}

export default Profile;
