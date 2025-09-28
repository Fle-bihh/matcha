import { UserList } from "@/components/UserList.component";
import Provider from "@/components/Provider.component";

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
