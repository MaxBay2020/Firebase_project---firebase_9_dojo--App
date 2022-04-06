import Books from "./components/Books";
import Auth from "./components/Auth";

const App = () => {
    return (
    <div className="App">
      <h1>Firebase 9 Tutorial</h1>
        <h2>FirebaseCRUD</h2>
        <Books />
        <hr/>
        <h2>Authentication</h2>
        <Auth />
    </div>
  );
}

export default App;
