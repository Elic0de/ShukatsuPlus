<template>
	<div class="kPqwA _2kkzG">
		<div class="flex flex-col">
			<div class="_2HEhk">
				<div class="flex flex-col gap-6 px-4 pb-24.5">
					<ProfileHeader
						title="プロフィール"
						settingsLink=""
					/>
					<ProfileAvatar :avatarUrl="profile.avatarUrl" />
					<ProfileInfo
						:username="userStore.name"
						:nickname="userStore.name"
						:joinedAt="userStore.joinedAt"
					/>
					<ProfileStats :stats="profile.stats" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import ProfileHeader from "@/components/profile/ProfileHeader.vue";
	import ProfileAvatar from "@/components/profile/ProfileAvatar.vue";
	import ProfileInfo from "@/components/profile/ProfileInfo.vue";
	import ProfileStats from "@/components/profile/ProfileStats.vue";
	import { useUserStore } from "@/stores/user"
	
	const userStore = useUserStore();


	// 例: 実際は API から取得
	const profile = {
		avatarUrl:
			"https://d35aaqx5ub95lt.cloudfront.net/images/7a24dbe6c243d2bbf8b6c8aad73dc941.svg",
		username: "ひいろ",
		nickname: "ひい2ろ",
		joinedAt: "none",
		stats: [
			{
				iconUrl:
					"https://d35aaqx5ub95lt.cloudfront.net/images/profile/8a6dca76019d059a81c4c7c1145aa7a4.svg",
				value: 2,
				label: "連続記録",
			},
			{
				iconUrl:
					"https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg",
				value: 6469,
				label: "累計XP",
			},
			{
				iconUrl:
					"https://d35aaqx5ub95lt.cloudfront.net/images/profile/3f97ae337724f7edb6dfbef23cd3a6e7.svg",
				value: 5,
				label: "トップ3入りの回数",
			},
		],
	};
</script>
