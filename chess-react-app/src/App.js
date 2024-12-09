import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ChessGame from './view/ChessGame';
import HomePage from './view/HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<ChessGameWithRoomKey />} />
            </Routes>
        </Router>
    );
}

function ChessGameWithRoomKey() {
    const location = useLocation();
    const roomKey = location.state?.roomKey; // Get roomKey from navigation state

    if (!roomKey) {
        return <div>Error: Room key is missing. Please return to the homepage.</div>;
    }

    return <ChessGame roomKey={roomKey} />;
}

export default App;
