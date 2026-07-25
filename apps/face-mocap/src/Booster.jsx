import store, { boosters } from "./Store";
import { observer } from "mobx-react-lite";

const Booster = observer(() => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 500, width: 500 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                Booster 
                <input 
                    type="checkbox" 
                    defaultChecked={store.booster} 
                    onChange={e => store.booster = e.target.checked}
                />
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {Object.entries(store.blendshapes).map(([key, value], i) => {
                    return (
                        <div style={{ display: 'flex', width: 250, marginBottom: '8px', alignItems: 'center' }} key={i}>
                            <div style={{ width: '66%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={key}>{key}</div>
                            <div style={{ width: '16%', textAlign: 'right', paddingRight: '8px' }}>{parseFloat(value).toFixed(2)}</div>
                            <div style={{ width: '16%' }}>
                                <input 
                                    type="range" 
                                    onChange={e => {
                                        boosters[key] = parseFloat(e.target.value);
                                    }} 
                                    defaultValue={1} 
                                    min={0} 
                                    max={2} 
                                    step={0.1} 
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
})

export default Booster;