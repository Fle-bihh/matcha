import { withCondition } from "@/components/utils";
import { ROUTES } from "@/constants";

function Entry() {
	return <div>Entry Page</div>;
}

const EntryPage = withCondition(Entry, true, ROUTES.notFound);

export default EntryPage;
