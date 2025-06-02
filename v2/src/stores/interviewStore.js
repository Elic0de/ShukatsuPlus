import { defineStore } from "pinia";

export const useInterviewStore = defineStore("interview", {
	state: () => ({
		messages: [],
		summary: "",
	}),

	actions: {
		addMessage(message) {
			this.messages.push(message);
		},
		clearMessages() {
			this.messages = [];
		},
		setSummary(summary) {
			this.summary = summary;
		},
	},
});
