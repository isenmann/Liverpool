import { Route } from 'react-router';
import { Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Liverpool from './components/Liverpool';
import Game from './components/Game';

import './custom.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/Liverpool' element={<Liverpool/>} />
        <Route path='/Game/:name' element={<Game/>} />
      </Routes>
    </Layout>
  );
}

export default App;
