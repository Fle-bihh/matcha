export function useScroll() {
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: "instant" });
	}

	function scrollToBottom() {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: "smooth",
		});
	}

	return { scrollToTop, scrollToBottom };
}
