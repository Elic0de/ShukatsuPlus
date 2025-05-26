<script setup>
	import { ref } from "vue";
	import Spi from './components/Spi.vue';
	import TheWelcome2 from './components/TheWelcome.vue';

	const tabs = ref([
		{ id: "spi", url: Spi, name: "SPI", icon: "📒" },
		{ id: "mensetsu", url: TheWelcome2, name: "面接", icon: "💺" },
	]);
	const currentTab = ref(tabs.value[0]["id"]);
	const switchTab = (tab) => {
		currentTab.value = tab;
	};
</script>

<template>
	<div class="wrapper">
		<div class="content">
			<div v-for="tab in tabs" v-show="tab.id === currentTab">
				<component class="comp" :is="tab.url"></component>
			</div>
		</div>
		<div class="tab-wrapper">
			<div class="tab">
				<div v-for="tab of tabs" @click="switchTab(tab.id)" v-bind:class="tab.id === currentTab ? 'selected' : ''">
					<div class="tab-icon">
						{{tab["icon"]}}
					</div>
					<div>
						{{tab["name"]}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.content > *, .tab {
		width: 100%;
		height: 100%;
	}

	.display-none {
		display: none;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: 100vh;
	}

	.tab-wrapper {
		height: 48px;
	}

	.content {
		flex-grow: 1;
		overflow-y: scroll;
	}

	.tab {
		display: flex;
		flex-direction: row;
	}

	.tab > * {
		flex: 1;
		text-align: center;
		box-sizing: border-box;
		justify-content: center;
		align-content: center;
	}

	* {
		box-sizing: border-box;
	}

	.tab > * {
		font-size: 12px;
		transition: font-size ease-out 100ms;
		box-shadow: inset 0px 2px 4px #00000010;
	}
	.tab > *.selected {
		color: #1570c5;
		font-size: 14px;
		font-weight: bold;
		background-image: linear-gradient(180deg, #40b3e980, transparent);
	}

	.tab-icon {
		font-size: 20px;
		height: 20px;
		margin-bottom: 2px;
	}

	.tab {
		margin-left: auto;
		margin-right: auto;
		width: 700px;
	}

	.content {
		margin-left: 20px;
		margin-right: 20px;
	}

	@media screen and (max-width: 699px) {
		.tab {
			width: 100%;
		}

		.content {
			margin-left: 8px;
			margin-right: 8px;
		}
}
</style>
