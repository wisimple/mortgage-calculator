import { Component } from "react";
import MortgageCalculator from "./components/MortgageCalculator";

class App extends Component {
  render() {
    return (
      <div className="container">
        <MortgageCalculator />
      </div>
    );
  }
}

export default App;
