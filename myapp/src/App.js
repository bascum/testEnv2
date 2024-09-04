
import {useState} from "react";
import axios from 'axios';



function App() {

  const [data, setData] = useState("");

  const getData = async () => {
    let newData = await axios.get(window.location.href + "up");
    console.log(newData.data.recordsets[0][0].name);
    setData(newData.data.recordsets[0][0].name);
  }

  getData();

  return (
    <>
      <h2>{data}</h2>
    </>
  );
}

export default App;
