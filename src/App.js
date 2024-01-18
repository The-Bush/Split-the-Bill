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

        if (value > 50)
        {
          setNumPeople(50);
        }

        else
        {
          setNumPeople(value);
        }

      } 
      else if (name === 'billTotal') 
      {
        setBillTotal(parseFloat(value, 10));
      }

      // Update URL parameters
      const queryParams = queryString.stringify({ numPeople, billTotal });
      window.history.replaceState({}, '', `?${queryParams}`);
    }
  
    useEffect(() => {
      // Parse URL parameters
      const queryParams = queryString.parse(window.location.search);
      setNumPeople(queryParams.numPeople ? parseInt(queryParams.numPeople, 10) : 2);
      setBillTotal(queryParams.billTotal ? parseInt(queryParams.billTotal, 10) : 0);
    }, []);
  return (
    <div className="App">

      {/* Bootstrap CDN */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"></link>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      <body>
        <br></br>
        <TotalsInputForm handleInputChange={handleInputChange} numPeople={numPeople} billTotal={billTotal} />
        <Table numPeople={numPeople} billTotal={billTotal}/>
      </body>
    </div>
  );
}

function TotalsInputForm({ handleInputChange, numPeople, billTotal }) {

  return (
    <div class="TotalsInputForm">
      <form>
        <label>People</label>
        <div class="input-group mb-3">
          <input 
            type="number" 
            name="numPeople" 
            step="1"
            min="2"
            max="50"
            value={numPeople < 1 ? '' : numPeople}
            onChange={handleInputChange} 
            class="form-control"
            data-toggle="tooltip"
            data-placement="top"
            title="Maximum allowed is 50 people"
            />
        </div>
      </form>

      <form>
        <label>Bill Total</label>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">$</span>
          </div>
              <input 
                type="number" 
                name="billTotal" 
                step="0.01"
                min="0"
                value={billTotal}
                onChange={handleInputChange} 
                class="form-control"
                />
        </div>
      </form>
    </div>
  );
}

function Table({ numPeople, billTotal }) {
  const rows = Array.from({ length: Math.max(numPeople, 2) }, (_, index) => index + 1);

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
    <div class="table-responsive">
    <table class="table">
      <thead class="">
        <tr>
          <th>Name</th>
          <th
            data-toggle="tooltip"
            data-placement="top"
            title="Input costs this person is individually responsible for."
          >
            Individual
          </th>
          <th>Shared</th>
          <th>Total/person</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {billTotal > 0 && rows.map((row, index) => (
          <tr key={row} class="">
            <td>
              <form>
                <div class="input-group mb-3">
                <input
                  type="text"
                  name="individualNames"
                  value={individualNames[index]}
                  placeholder={`Person ${index}`}
                  onChange={(e) => handleIndividualNameChange(e, index)}
                  class="individual-names, form-control"
                  size="8"
                />
                </div>
              </form>
            </td>
            <td>
              <form>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">$</span>
                </div>
                <input
                  type="number"
                  name="individualCosts"
                  step="0.01"
                  min="0"
                  max={billTotal}
                  placeholder={individualCosts[index] || 0}
                  onChange={(e) => handleIndividualCostChange(e, index)}
                  class="individual-costs, form-control"
                  size="2"
                />
              </div>
              </form>
            </td>
            <td>{formatUSD((adjustedBillTotal / numPeople || 0))}</td>
            <td>{formatUSD((adjustedBillTotal / numPeople + (individualCosts[index] || 0) || 0))}</td>
          </tr>
        ))}
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>{billTotal > 0 ? formatUSD(individualCosts.reduce((sum, cost) => sum + cost, 0) + adjustedBillTotal) : "Input a Bill Total to get started. Click 'How to Use' at the top of the page for more help."}</td>
        </tr>
      </tbody>
    </table>
    </div>
    
    
  );
}



function formatUSD(amount)
{
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default App;
