import logo from './money-talk.png';
import './App.css';
import { useState, useEffect } from 'react';
import queryString from 'query-string';

function App() {

  const [numPeople, setNumPeople] = useState(2);
  const [billTotal, setBillTotal] = useState(0);

    const handleInputChange = (event) => 
    {
      const { name, value } = event.target;
      
      if (name === 'numPeople') 
      {
        setNumPeople(parseInt(value, 10));
      } 
      else if (name === 'billTotal') 
      {
        setBillTotal(parseInt(value, 10));
      }

      const queryParams = queryString.stringify({ numPeople: numPeople, billTotal: billTotal });
      window.history.replaceState(null, null, `?${queryParams}`);
    }
  
  return (
    <div className="App">

      {/* Bootstrap CDN */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"></link>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      
      <body>
      <img src={logo} alt="logo" />
        <h1>Split the Bill</h1>
        <TotalsInputForm handleInputChange={handleInputChange} numPeople={numPeople} billTotal={billTotal} />
        <Table numPeople={numPeople} billTotal={billTotal}/>
      </body>
    </div>
  );
}

function TotalsInputForm({ handleInputChange, numPeople, billTotal }) {

  return (
    <div className="TotalsInputForm">
      <form>
        <label>Number of people</label>
        <input 
          type="number" 
          name="numPeople" 
          step="1"
          min="2"
          onChange={handleInputChange} />
        <label>Bill Total</label>
        <input 
          type="number" 
          name="billTotal" 
          step="0.01"
          min="0"
          onChange={handleInputChange} />
      </form>
    </div>
  );
}

function Table({ numPeople, billTotal }) {
  const rows = Array.from({ length: numPeople }, (_, index) => index + 1);

  const [individualCosts, setIndividualCosts] = useState(() => new Array(numPeople).fill(0));
  const [individualNames, setIndividualNames] = useState(() => new Array(numPeople).fill(''));

  const [adjustedBillTotal, setAdjustedBillTotal] = useState(billTotal);

  useEffect(() => {
    // Calculate the sum of individual costs
    const totalIndividualCosts = individualCosts.reduce((sum, cost) => sum + cost, 0);

    // Adjust the bill total by subtracting the total individual costs
    setAdjustedBillTotal(billTotal - totalIndividualCosts);
  }, [individualCosts, billTotal]);


  const handleIndividualCostChange = (event, index) => {
    const newIndividualCosts = [...individualCosts];

    if (event.target.value === '') {
      newIndividualCosts[index] = 0;
    }
    // if the input is greater than adjusted bill total, set it to the adjusted bill total
    else if (event.target.value > billTotal) {
      newIndividualCosts[index] = billTotal;
    }
    // if the input is less than 0, set it to 0
    else if (event.target.value < 0) {
      newIndividualCosts[index] = 0;
    }
    // otherwise, set it to the input value
    else
    {
      newIndividualCosts[index] = parseFloat(event.target.value);
    }
    setIndividualCosts(newIndividualCosts);
  };

  const handleIndividualNameChange = (event, index) => {
    const newIndividualNames = [...individualNames];
    newIndividualNames[index] = event.target.value;
    setIndividualNames(newIndividualNames);
  }

  return (
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Person</th>
          <th>Individual purchases</th>
          <th>Shared purchases</th>
          <th>Total/person</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row}>
            <td>
              <form>
                <input
                  type="text"
                  name="individualNames"
                  value={individualNames[index]}
                  placeholder={`Person ${index}`}
                  onChange={(e) => handleIndividualNameChange(e, index)}
                />
              </form>
            </td>
            <td>
              <form>
                <input
                  type="number"
                  name="individualCosts"
                  step="0.01"
                  min="0"
                  max={billTotal}
                  onChange={(e) => handleIndividualCostChange(e, index)}
                />
              </form>
            </td>
            <td>{formatUSD((adjustedBillTotal / numPeople || 0))}</td>
            <td>{formatUSD((adjustedBillTotal / numPeople + (individualCosts[index] || 0) || 0))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatUSD(amount)
{
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default App;
