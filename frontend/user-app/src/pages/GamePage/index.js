import React from 'react';
import Game from "./components/Game";
import '../GamePage/style/index.css';
import Regulations from './components/Regulation';

function GamePage() {
    return (
        <div className="flex">
            <div className="w-1/2">
                <Regulations />
            </div>

            <div className="w-1/2">
                <Game />
            </div>
        </div>
    );
}

export default GamePage;
