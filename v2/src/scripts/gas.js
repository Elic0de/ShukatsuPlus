"use strict";

const GAS_API_ENDPOINT = "https://script.google.com/macros/s/AKfycbwfKSr7DkneqbXE4T2fxbPJ9ZnZtt-zzSGIdFeyjILUuxqslJNWTQMJFmt5qimKxVsl7Q/exec";

export const postGas = (path, body, handlers) => {
	const xhr = new XMLHttpRequest();
	const url = new URL(GAS_API_ENDPOINT);
	url.searchParams.set("path", path);

	if (handlers) {
		xhr.onabort = handlers.abort;
		xhr.onerror = handlers.error;
		xhr.onload = handlers.load;
		xhr.onloadend = handlers.loadend;
		xhr.onloadstart = handlers.loadstart;
		xhr.onprogress = handlers.progress;
		xhr.onreadystatechange = handlers.readystatechange;
		xhr.ontimeout = handlers.timeout;
	}

	xhr.open("POST", url.toString());
	// application/json にすると失敗する
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(JSON.stringify(body));

	return xhr;
};
