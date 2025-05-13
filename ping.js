// ping.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const urls = process.env.URLS?.split(/\s+/) || [];

async function ping(url) {
  // نُنشئ AbortController لقطع الاتصال يدويًا
  const controller = new AbortController();
  const { signal } = controller;

  try {
    // نبدأ الطلب
    const responsePromise = fetch(url, { signal });

    // عند استلام الهيدر نطبع الحالة ونقطع الاتصال
    responsePromise.then(res => {
      console.log(`[${new Date().toISOString()}] ${url} → ${res.status}`);
      controller.abort();
    });

    // ننتظر انتهاء promise حتى لا يحدث UnhandledRejection
    await responsePromise.catch(() => {});
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`[${new Date().toISOString()}] ${url} → connection closed immediately after opening`);
    } else {
      console.error(`[${new Date().toISOString()}] ${url} → error:`, err.message);
    }
  }
}

async function main() {
  for (const url of urls) {
    await ping(url);
  }
}

main();
