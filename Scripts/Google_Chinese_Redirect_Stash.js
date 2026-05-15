/*************************************
项目名称：Google 自动中文跳转
适用工具：Stash
脚本类型：request script

功能：
1. g.cn / google.cn 跳转到 www.google.com
2. maps.google.cn / ditu.google.cn 跳转到 maps.google.com
3. google.com / maps.google.com 自动添加 hl=zh-CN
4. 默认添加 gl=TW，可自行改成 HK / TW / CN / 空
*************************************/

const LANGUAGE = "zh-CN";

// "" = 不强制地区，只改语言
// "HK" = 偏香港地区
// "TW" = 偏台湾地区
// "CN" = 偏中国大陆地区
const REGION = "TW";

function doneNoChange() {
  $done({});
}

try {
  const rawUrl = $request.url;
  const url = new URL(rawUrl);
  const host = url.hostname.toLowerCase();

  url.protocol = "https:";

  // g.cn / google.cn → www.google.com
  if (
    host === "g.cn" ||
    host === "google.cn" ||
    host === "www.google.cn"
  ) {
    url.hostname = "www.google.com";
  }

  // maps.google.cn / ditu.google.cn → maps.google.com
  else if (
    host === "maps.google.cn" ||
    host === "ditu.google.cn"
  ) {
    url.hostname = "maps.google.com";
  }

  // google.com → www.google.com
  else if (host === "google.com") {
    url.hostname = "www.google.com";
  }

  // www.google.com / maps.google.com 保持原 host
  else if (
    host === "www.google.com" ||
    host === "maps.google.com"
  ) {
    // keep
  }

  // 其他域名不处理
  else {
    doneNoChange();
  }

  // 添加中文界面参数
  url.searchParams.set("hl", LANGUAGE);

  // 可选：强制搜索地区
  if (REGION) {
    url.searchParams.set("gl", REGION);
  }

  const target = url.toString();

  $done({
    response: {
      status: 302,
      headers: {
        Location: target,
        "Cache-Control": "no-store"
      },
      body: ""
    }
  });
} catch (e) {
  doneNoChange();
}
