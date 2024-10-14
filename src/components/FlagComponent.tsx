import { useState, useEffect } from 'react';
import Typewriter from './TypeWriter';


const FlagComponent = () => {
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState('');
  const [error, setError] = useState('');
  const api = process.env.REACT_APP_CAPTURE_THE_FLAG_API_URL as string;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(api).then((response) => response.text());
        setFlag(response);
        setLoading(false);
        setError('');
      }
      catch (error) {
        setError(`Error fetching response! + ${error}`);
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (error.length) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {loading ? <p>Loading...</p> : <Typewriter text={flag}/>}
    </div>
  );
};

export default FlagComponent;