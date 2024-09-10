import React from 'react';
import Game from "./components/Game";
import '../GamePage/style/index.css';
import Regulations from './components/Regulation';
import ProtectedRoute from '../../components/ProtectedRoute';

function GamePage() {
    return (
        <ProtectedRoute>
            <div className="flex">
                <div className="w-1/2">
                    <Regulations />
                </div>

                <div className="w-1/2">
                    <Game />
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default GamePage;
