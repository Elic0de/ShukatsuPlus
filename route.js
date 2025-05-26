(function() {
	"use strict";

	const { createApp, ref } = Vue;

	createApp({
		setup() {
			const tabs = ref([
				{ id: "spi", url: "./spi", name: "SPI", icon: "📒" },
				{ id: "mensetsu", url: "./mensetsu/work-manage-account.html", name: "面接", icon: "💺" },
			]);
			const currentTab = ref(tabs.value[0]["id"]);
			const switchTab = (tab) => {
				currentTab.value = tab;
			};

			return window.d = {
				tabs, currentTab, switchTab,
			};
		},
	}).mount("#app");
})();
