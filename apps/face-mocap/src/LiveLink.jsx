/* eslint-disable */
import { observer } from "mobx-react-lite";
import store, { unRealblendshapes as _unRealblendshapes } from "./Store";

const Connect = () => {
    store.connected = !store.connected;
}

const LiveLink = observer(() => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> ws:// </span> 
                <input 
                    type="text"
                    className="premium-input"
                    style={{ flex: 1 }} 
                    value={store.serverAddress} 
                    onChange={e => store.serverAddress = e.target.value}
                />
            </div>
            <button 
                className={`premium-btn ${store.connected ? 'danger' : 'accent'}`}
                style={{ width: '100%' }}
                onClick={Connect}
            >
                {store.connected ? 'Disconnect LiveLink' : 'Connect LiveLink'}
            </button>
        </div>
    );
})

export default LiveLink;