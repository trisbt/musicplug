import * as React from 'react';

function DbScale({ db, maxDb, minDb }) {
    const percentage = (db - minDb) / (maxDb - minDb) * 100;
    
    const dBLabels = [0, -5, -10, -15, -20, -25, -30,];

    return (
        <div className="fader-container">
            <div className="fader-scale">
                {dBLabels.map(label => (
                    <div key={label}>{label}</div>
                ))}
            </div>
            <div className="fader-slider-container">
                <div className="fader-slider" style={{ height: `${percentage}%` }}></div>
            </div>
            
        </div>
    );
}

export default DbScale
