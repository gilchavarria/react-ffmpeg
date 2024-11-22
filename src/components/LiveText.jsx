import React, { useState } from 'react';

function LiveText() {
    const [text, setText] = useState('Hello, World!'); // Initial text

    const handleChange = (event) => {
        setText(event.target.value);
    };

    return (
        <div>
            <input type="text" value={text} onChange={handleChange} />
            <p>{text}</p>
        </div>
    );
}

export default LiveText;