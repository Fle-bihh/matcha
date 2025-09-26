import { UserList } from "./components/UserList";
import Provider from "./Provider";

function App() {
	return (
		<Provider>
			<div>
				<h1>Hello World</h1>
				<UserList />
			</div>
		</Provider>
	);
}

export default App;
