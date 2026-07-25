import { observer } from "mobx-react-lite";
import store, { unRealblendshapes } from "./Store";

let animationLoop;
let socket;

const Connect = () => {
    if (store.connected) {
        socket.close();
        return;
    }
    socket = new WebSocket('ws://localhost:5000/echo');

    socket.onopen = function () {
        store.connected = true;
        console.log('WebSocket connection established');
        sendData();
    };

    socket.onmessage = function (event) {
        console.log('Message from server:', event.data);
    };

    socket.onclose = () => {
        store.connected = false;
        cancelAnimationFrame(animationLoop);
    }

    // Send data to the server
    function sendData() {
        socket.send(JSON.stringify(unRealblendshapes));
        animationLoop = requestAnimationFrame(sendData)
    }
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