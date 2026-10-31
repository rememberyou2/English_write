# 劍橋寫作練習室

仿照 Cambridge English 寫作考試的練習網站，從兒童的 Starters、Movers、Flyers 到 C2 Proficiency，也有雅思（IELTS）Academic 與 General Training 的 Task 1、Task 2 題目，依雅思四項標準給 0–9 Band 分數。

- 直接打開 `index.html`，或用 GitHub Pages 發布（Settings → Pages → Branch: main / root）。
- 作品、經驗值與徽章存在瀏覽器裡（可在「我的紀錄」匯出／匯入備份）。
- AI 批改需要在「AI 設定」輸入自己的 Anthropic API 金鑰；金鑰只存在該裝置的瀏覽器，請勿把金鑰寫進程式碼。
- 題目為自行編寫的練習題（雅思圖表的數據為虛構），AI 評分僅供參考。

## 家庭排行榜（選用）

在 GitHub Pages 打開網站時，上方會多一個「排行榜」分頁。每篇作品第一次經 AI 批改後，暱稱、級數、題目和分數會送到你們自己的 Supabase 資料庫（不送文章內容），排行榜依平均分數排名，劍橋和雅思分開。

網站已經內建這個儲存庫自己的 Supabase 專案，家人只要在「排行榜 → 設定」填上暱稱和同一個房間代碼就能加入，也可以按「複製邀請連結」傳給他們。

如果要改用另一個 Supabase 專案：在 SQL Editor 執行設定頁裡「複製 SQL」的內容，再把 Project URL 和 publishable key 填進「資料庫設定」。

publishable key 本來就是給網頁公開使用的金鑰，不是密碼；但知道連結的人都能讀取和送出分數，請只分享給認識的人。
