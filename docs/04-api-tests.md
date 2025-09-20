## 🧪 API Testing with Postman

This project uses **Postman** collections to define, test, and document APIs in a consistent way.

-   **Collections per feature:** Each feature (e.g. `auth`, `messaging`, `notifications`) has its own Postman collection file.
-   **Versioned in Git:** Collections are always **exported** and pushed to the repository so contributors can import them and run the same tests.
-   **Descriptions & tests:** Every request includes:

    -   A **short description** explaining its purpose
    -   **2–3 basic test scripts** (status code, response time, and simple schema or header checks)

This ensures that API behavior can be validated quickly and consistently, and that new developers can easily understand the available endpoints and their expected outputs.
