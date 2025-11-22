import { useState } from 'react';
import './App.css';
import Card from './components/Card';
import Pack from './components/Pack';
import Collection from './components/Collection';
import Menu from './components/Menu';

function App() {
    const [currentPage, setCurrentPage] = useState('pack');

    const renderPage = () => {
        switch(currentPage) {
            case 'pack':
                return <Pack />;
            case 'card':
                return <Card />;
            case 'collection':
                return <Collection />;
            default:
                return <Pack />;
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <Menu currentPage={currentPage} onPageChange={setCurrentPage} />
                <h1>tommy-gamba</h1>
            </header>
            <main>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;