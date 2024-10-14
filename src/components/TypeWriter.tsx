import { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
  }

const Typewriter = (props: TypewriterProps) => {
    const { text } = props;
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = -1;
        const interval = setInterval(() => {
            index++;
            if (index === text.length) {
                clearInterval(interval); return;
            };
            setDisplayedText((prev) => prev + text[index]);
        }, 500);

        return () => clearInterval(interval);
    },  [text]);

    return (
        <ul>
            {displayedText.split('').map((char, i) => (
            <li key={i}>{char}</li>
            ))}
      </ul>
    );
}

export default Typewriter;
