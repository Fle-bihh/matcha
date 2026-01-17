export function useScroll() {
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: "instant" });
	}

	return { scrollToTop };
}
