<script setup>
	import { ref, computed, watch, markRaw, onMounted, onBeforeUnmount } from "vue";
	import Spi from './components/Spi.vue';
	import AccountManager from './components/AccountManager.vue';
	import TheWelcome2 from './components/TheWelcome.vue';
	import Mensetsu from "./components/Mensetsu.vue";

	const instMensetsu = ref(null);

	const tabs = ref([
		{ id: "spi", url: markRaw(Spi), name: "SPI", icon: "pencil" },
		{ id: "mensetsu", url: markRaw(Mensetsu), name: "面接", icon: "comments" },
		{ id: "account", url: markRaw(AccountManager), name: "アカウント", icon: "user" },
	]);

	const scrollLocations = ref((() => {
		const rslt = {};
		for (let i of tabs.value) rslt[i["id"]] = 0;
		return rslt;
	})());
	const currentTab = ref(tabs.value[0]["id"]);
	const switchTab = (tab) => {
		currentTab.value = tab;
		instMensetsu.value && instMensetsu.value.updateRoomListIfEmpty();
		window.scrollTo(0, 0);
	};
	const whiteHeader = ref(false);
	const sessionId = ref(localStorage.getItem("SessionId"));
	const username = ref(localStorage.getItem("Username"));
	watch(sessionId, v => {
		localStorage.setItem("SessionId", v);
		window.setTimeout(() => instMensetsu.value && instMensetsu.value.updateRoomList(), 1000);
	});
	watch(username, v => {
		localStorage.setItem("Username", v);
	});

	const onScroll = () => {
		whiteHeader.value = window.scrollY <= 48;
		scrollLocations.value[currentTab.value] = window.scrollY;
	};
	onMounted(() => {
		window.addEventListener("scroll", onScroll);
		onScroll();
	});
	onBeforeUnmount(() => {
		window.removeEventListener("scroll", onScroll);
	});
</script>

<template>
	<div class="wrapper">
		<div v-bind:class="'tab-wrapper' + (whiteHeader ? ' tab-wrapper-white' : '')">
			<div class="tab">
				<div class="tw"><i class="fa fa-twitter" aria-hidden="true"></i></div>
				<a href="" v-for="tab of tabs" @click.prevent="switchTab(tab.id)" v-bind:class="tab.id === currentTab ? 'selected' : ''">
					<div class="tab-icon">
						<i v-bind:class="'fa fa-' + tab.icon" aria-hidden="true"></i>
					</div>
					<div class="tab-text">
						{{tab["name"]}}
					</div>
				</a>
			</div>
		</div>
		<div class="content">
			<div v-show="currentTab === 'spi'" ><Spi /></div>
			<div v-show="currentTab === 'mensetsu'" ><Mensetsu :session-id="sessionId" :username="username" ref="instMensetsu" /></div>
			<div v-show="currentTab === 'account'" ><AccountManager v-model:session-id="sessionId" v-model:username="username" /></div>
			<!-- <div v-for="tab in tabs" v-show="tab.id === currentTab">
				<component :is="tab.url" v-model:session-id="sessionId" v-model:username="username"></component>
			</div> -->
		</div>
	</div>
</template>

<style scoped>
	.tw {
		position: absolute;
		left: 0px;
		right: 0px;
		height: auto;
		pointer-events: none;
		top: 0px;
		font-size: 30px!important;
		* {
			color: #1B9DF0;
		}
	}

	.tab > * {
		display: block;
		user-select: none;
		color: black;
		text-decoration: none;
	}

	.tab-text {
		margin-left: 4px;
	}

	.tab > * > * {
		display: inline;
		vertical-align: middle;
	}

	.content > *, .tab {
		width: 100%;
		height: 100%;
	}

	.wrapper {
		height: 100%;
		position: relative;
	}

	.tab-wrapper {
		z-index: 400;
		height: 48px;
		position: fixed;
		left: 0px;
		right: 0px;
		top: 0px;
		background-color: #ffffff;
		background-color: #ffffff80;
		backdrop-filter: blur(10px);
		transition: background-color ease-out 250ms;
		.tab > * {
			transition: font-size ease-out 100ms,
				color ease-out 250ms,
				text-shadow ease-out 250ms;
		}
	}

	.content {
		flex-grow: 1;
		overflow-y: auto;
		margin-bottom: 0px;
		margin-top: 0px;
		padding-top: 48px;
	}

	.tab {
		display: flex;
		flex-direction: row;
	}

	.tab > * {
		text-align: center;
		box-sizing: border-box;
		justify-content: center;
		align-content: center;
	}

	* {
		box-sizing: border-box;
	}

	.tab > * {
		font-size: 14px;
		transition: font-size ease-out 100ms;
		box-shadow: inset 0px 2px 4px #00000010;
		padding-left: 16px;
		padding-right: 16px;
	}
	.tab > *.selected {
		color: #1570c5;
		/* font-weight: bold; */
		background-image: linear-gradient(180deg, #40b3e980, transparent);
		.tab-text {
			text-shadow: -0.5px 0px 0px #1570c5, 0.5px 0px 0px #1570c5;
		}
	}

	.tab-icon {
		font-size: 20px;
		height: 20px;
		margin-bottom: 2px;
	}

	.tab {
		margin-left: 80px;
	}

	.content {
		margin-left: 20px;
		margin-right: 20px;
	}

	@media screen and (min-width: 1000px) {
		.content {
			margin-left: 150px;
			margin-right: 150px;
		}
	}
	@media screen and (min-width: 1500px) {
		.content {
			margin-left: 400px;
			margin-right: 400px;
		}
	}
	@media screen and (min-width: 700px) {
		.tab-wrapper-white {
			background-color: #40b3e980;
			.tab > *, .tw * {
				color: white;
			}
			.tab > *.selected {
				color: white;
				background-image: linear-gradient(0deg, #ffffff80, transparent);
				.tab-text {
					text-shadow: -0.5px 0px 0px white, 0.5px 0px 0px white;
				}
			}
		}
	}
	@media screen and (max-width: 699px) {
		.tab {
			width: 100%;
			margin-left: 0px;
		}

		.content {
			margin-left: 8px;
			margin-right: 8px;
			margin-bottom: 48px;
			margin-top: 0px;
			padding-top: 0px;
		}

		.tab > * > * {
			display: block;
		}

		.tab > * {
			font-size: 12px;
			flex: 1;
			padding-left: 4px;
			padding-right: 4px;
		}
		.tab > *.selected {
			font-size: 14px;
		}
		.tab-text {
			margin-left: 0px;
		}

		.tab-wrapper {
			top: auto;
			bottom: 0px;
		}
		.tab > .tw {
			display: none;
		}
	}
</style>
