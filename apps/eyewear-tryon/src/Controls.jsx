import { observer } from "mobx-react-lite";
import store, { keyFrames } from "./Store";
import { recordBlendshapesToCSV } from "./Recorder";

const Controls = observer(() => {
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
                onClick={recordBlendshapesToCSV} 
                disabled={!store.tracking}
            >
                {store.recording ? 'Stop Recording' : 'Record'}
            </button>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {keyFrames.length ? 'decoded frames: ' + keyFrames.length : ''}
            </div>
        </div>
    );
});

export default Controls;