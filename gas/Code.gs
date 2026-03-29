/**
 * 思考パターン分析テスト — Google Apps Script (GAS) WebApp
 * 
 * 設定方法:
 * 1. このコードをApps Scriptエディタに貼り付け
 * 2. スプレッドシートに列ヘッダーを追加（1行目）
 * 3. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」
 * 4. アクセス権を「全員」に設定してデプロイ
 * 5. 生成されたURLをindex.htmlのGOOGLE_SCRIPT_URLに設定
 * 
 * スプレッドシート1行目のヘッダー（自動セットアップ用）:
 * 名前 | 日付 | 白黒思考 | 過度の一般化 | 読心術的思考 | アンガー思考 |
 * 被害者意識思考 | マウンティング思考 | 回避型思考 | 認知バイアス思考 |
 * 他責思考 | 自責思考 | 差別性 | 依存思考 | 変化拒否思考 | 他人比較思考 | 成功恐怖思考
 */

/**
 * スプレッドシートのヘッダーを初期化（初回のみ実行）
 */
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = [
    '名前', '日付',
    '白黒思考', '過度の一般化', '読心術的思考', 'アンガー思考',
    '被害者意識思考', 'マウンティング思考', '回避型思考', '認知バイアス思考',
    '他責思考', '自責思考', '差別性', '依存思考', '変化拒否思考',
    '他人比較思考', '成功恐怖思考'
  ];
  
  // 1行目が空の場合のみヘッダーを設定
  if (!sheet.getRange('A1').getValue()) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

/**
 * POST: テスト結果をシートに追記
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ヘッダーがなければ作成
    if (!sheet.getRange('A1').getValue()) {
      setupHeaders();
    }
    
    sheet.appendRow([
      data.name,
      data.date,
      data.scores.blackWhite,
      data.scores.overgeneralization,
      data.scores.mindReading,
      data.scores.anger,
      data.scores.victimMentality,
      data.scores.mounting,
      data.scores.avoidance,
      data.scores.cognitiveBias,
      data.scores.blaming,
      data.scores.selfBlaming,
      data.scores.discrimination,
      data.scores.dependency,
      data.scores.resistanceToChange,
      data.scores.comparison,
      data.scores.fearOfSuccess
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET: 指定した名前の過去データを取得
 * クエリパラメータ: ?name=テスト名
 */
function doGet(e) {
  try {
    const name = e.parameter.name;
    
    if (!name) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'name parameter is required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const header = data[0];
    
    // 指定した名前のデータのみフィルタ
    const results = data.slice(1)
      .filter(row => row[0] === name)
      .map(row => {
        const obj = {};
        header.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });
    
    return ContentService
      .createTextOutput(JSON.stringify(results))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
