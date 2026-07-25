import { observer } from "mobx-react-lite";
import store from "./Store";
import { mocapPlugin } from "./ThreeD";

const Controls = observer(() => {
    const handleRecordToggle = () => {
        if (store.recording) {
            store.recording = false;
            mocapPlugin.downloadCSV('BlendshapeData.csv');
        } else {
            store.recording = true;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                    type="checkbox" 
                    className="premium-checkbox"
                    checked={store.grid} 
                    onChange={e => store.grid = e.target.checked} 
                />
                Show Grid
            </label>
            <button 
                className={`premium-btn ${store.recording ? 'danger' : 'accent'}`}
                style={{ width: '100%' }}
                onClick={handleRecordToggle} 
                disabled={!store.tracking}
            >
                {store.recording ? 'Stop Recording' : 'Record'}
            </button>
        </div>
    );
});

export default Controls;