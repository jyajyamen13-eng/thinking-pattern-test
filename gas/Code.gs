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
 * GET: データ取得
 * クエリパラメータ:
 *   ?name=テスト名  — 指定名のデータのみ返す
 *   ?all=true       — 全データを返す（ダッシュボード用）
 */
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const name = e.parameter.name || '';
  const all = e.parameter.all === 'true';
  
  const results = [];
  for (let i = 1; i < data.length; i++) {
    if (all || data[i][0] === name) {
      results.push({
        name: data[i][0], date: data[i][1],
        blackWhite: data[i][2], overgeneralization: data[i][3],
        mindReading: data[i][4], anger: data[i][5],
        victimMentality: data[i][6], mounting: data[i][7],
        avoidance: data[i][8], cognitiveBias: data[i][9],
        blaming: data[i][10], selfBlaming: data[i][11],
        discrimination: data[i][12], dependency: data[i][13],
        resistanceToChange: data[i][14], comparison: data[i][15],
        fearOfSuccess: data[i][16]
      });
    }
  }
  return ContentService.createTextOutput(JSON.stringify(results)).setMimeType(ContentService.MimeType.JSON);
}
