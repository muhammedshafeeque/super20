import { useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';

const Home = () => {
  const { setTitle } = useAuth();

  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);
 
  return (
    <div style={{border: 'solid 1px red'}}>
        <h1>Home</h1>
    
    </div>
  )
}

export default Home
