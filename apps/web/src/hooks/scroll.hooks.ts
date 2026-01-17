export function useScroll() {
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return { scrollToTop };
}
