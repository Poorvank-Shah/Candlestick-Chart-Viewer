import './App.css';
import CandleChart from './components/chart/CandleChart';
import Footer from './components/navbar/Footer';
import Navbar  from './components/navbar/Navbar';

function App() {
  return (
    <>
      <Navbar></Navbar>
      <CandleChart></CandleChart>
      <Footer></Footer>
    </>
  );
}

export default App;

