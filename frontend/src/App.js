import "./App.css";

function App() {
  return (
    <div className="App">
      <h2>My Alerts</h2>
      <table>
        <tr>
          <th>Campground/Permit</th>
          <th>Check-in Date</th>
          <th>Check-out Date</th>
          {/* <th>Reminder Frequency</th> */}
          {/* <th>Notification System</th> */}
          <th>Enabled?</th>
        </tr>
        <tr>
          <td>Yosemite Upper Pines</td>
          <td>09/10/21</td>
          <td>09/15/21</td>
          {/* <td>Every day</td> */}
          {/* <td>Email</td> */}
          <td>True</td>
        </tr>
        <tr>
        <td>Yosemite Lower Pines</td>
          <td>10/10/21</td>
          <td>10/15/21</td>
          {/* <td>Every week</td> */}
          {/* <td>Text/Email</td> */}
          <td>True</td>
        </tr>
      </table>
    </div>
  );
}

export default App;
