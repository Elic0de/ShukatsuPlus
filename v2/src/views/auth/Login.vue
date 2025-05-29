<template>
    <div class="flex justify-center items-center w-full relative p-7.5 bg-white">
        <form class="mt-10 relative text-center" action="">
            <div>
                <h1 class="text-2xl text-center font-bold mt-2.5 mb-3.75">ログイン</h1>
                <div class="flex flex-col text-2xl relative text-start w-full">
                    <div class="mt-2 w-full inline-flex flex-col gap-4">
                        <div
                            class="mt-2 w-full bg-neutral-50 border-2 rounded-xl border-neutral-200 flex overflow-hidden ">
                            <input class="px-3.5 py-2 w-full shadow-none caret-blue-200" type="text" name="" id=""
                                placeholder="ユーザ名">
                        </div>
                        <div
                            class="mt-2 w-full bg-neutral-50 border-2 rounded-xl border-neutral-200 flex overflow-hidden ">
                            <input class="px-3.5 py-2 w-full shadow-none caret-blue-200" type="text" name="" id=""
                                placeholder="パスワード">
                        </div>
                    </div>
                    <button
                        class="mt-5 w-full rounded-2xl bg-blue-300 text-white px-4 h-12.5 border-b-4 border-blue-400">
                        <span>ログイン</span>
                    </button>
                    <div class="items-center flex justify-center mt-5">
                        <div class="bg-neutral-300 h-0.25 flex-grow"></div>
                        <div class="text-neutral-300 flex-grow-0 px-2 text-[15px] font-bold">または</div>
                        <div class="bg-neutral-300 h-0.25 flex-grow"></div>
                    </div>
                    <p class="gap-4 grid mt-5">
                        <button
                            class="mt-5 w-full rounded-2xl bg-white-300 text-white px-4 h-12.5 border-b-4 border-neutral-100 border-2 items-center justify-center relative inline-flex ">
                            <img src="" alt="">
                            <span class="text-green-300">LINE</span>
                        </button>
                    </p>
                </div>
            </div>
            <div class="items-center flex flex-col pb-2.5 pt-10">
                <div class="mb-5 text-neutral-400 text-sm">
                    <span>
                        ログインすると就活対策の利用規約とプライバシーポリシーに同意したことになります。
                    </span>
                </div>
                <div class="font-bold text-neutral-500">
                    アカウントをお持ちではないですか?
                    <span class="text-blue-400 cursor-pointer ml-1.25 text-[15px]">登録</span>
                </div>
            </div>
        </form>
    </div>
</template>