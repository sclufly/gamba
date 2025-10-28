import './App.css';
import Card from './components/Card';
import Pack from './components/Pack';

function App() {
    return (
        <div className="App">
            <header className="App-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>tommy-gamba</h1>
            </header>
            <main>
                {/* <Card /> */}
                <Pack />
            </main>
        </div>
    );
}

export default App;