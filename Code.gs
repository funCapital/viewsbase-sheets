/**
 * Clipping Payout Calculator by ViewsBase (https://viewsbase.com)
 * Free custom functions for clipping and UGC campaign math. MIT licensed.
 * No data leaves your spreadsheet.
 */

/** @OnlyCurrentDoc */

function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
    .addItem('Open calculator', 'showSidebar')
    .addItem('Insert payout template', 'insertTemplate')
    .addToUi();
}

function onInstall(e) { onOpen(e); }

function onHomepage(e) {
  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle('Clipping Payout Calculator'))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(
        'Use =CLIPPING_PAYOUT(views, cpm, cap) and =CLIPPING_CPM(spend, views) in any cell. Open Extensions → Clipping Payout Calculator → Open calculator for the sidebar.'))
      .addWidget(CardService.newTextButton().setText('Free tools on ViewsBase')
        .setOpenLink(CardService.newOpenLink().setUrl('https://viewsbase.com/tools?utm_source=sheets_addon'))))
    .build();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('Clipping Payout Calculator');
  SpreadsheetApp.getUi().showSidebar(html);
}

/** Inserts a ready-made payout table on a new sheet. */
function insertTemplate() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = 'Clipping payouts';
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  sh.getRange('A1:F1').setValues([['Creator', 'Post URL', 'Views', 'CPM ($)', 'Cap ($)', 'Payout ($)']]).setFontWeight('bold');
  sh.getRange('A2:E4').setValues([
    ['@creator_one', '', 120000, 1.5, 300],
    ['@creator_two', '', 480000, 1.5, 300],
    ['@creator_three', '', 35000, 2, '']
  ]);
  sh.getRange('F2:F4').setFormulas([['=CLIPPING_PAYOUT(C2,D2,E2)'], ['=CLIPPING_PAYOUT(C3,D3,E3)'], ['=CLIPPING_PAYOUT(C4,D4,E4)']]);
  sh.getRange('E6').setValue('Total');
  sh.getRange('F6').setFormula('=SUM(F2:F5)');
  sh.getRange('A8').setValue('Track views automatically and flag fake views: https://viewsbase.com');
  sh.autoResizeColumns(1, 6);
}

function num_(v, label) {
  if (v === '' || v === null || v === undefined) return null;
  var n = Number(v);
  if (isNaN(n)) throw new Error(label + ' must be a number');
  if (n < 0) throw new Error(label + ' cannot be negative');
  return n;
}

function map_(input, fn) {
  return Array.isArray(input) ? input.map(function (r) { return r.map(fn); }) : fn(input);
}

/**
 * Payout for a post paid per 1,000 views, with an optional cap.
 *
 * @param {number|Array} views Views on the post (or a range).
 * @param {number} cpm Payout per 1,000 views, e.g. 1.5.
 * @param {number} [cap] Optional maximum payout per post.
 * @param {number} [min_views] Optional minimum views before anything is paid.
 * @return The payout, rounded to cents.
 * @customfunction
 */
function CLIPPING_PAYOUT(views, cpm, cap, min_views) {
  var c = num_(cpm, 'cpm'), k = num_(cap, 'cap'), m = num_(min_views, 'min_views') || 0;
  if (c === null) throw new Error('cpm is required');
  return map_(views, function (v) {
    var n = num_(v, 'views');
    if (n === null) return '';
    if (n < m) return 0;
    var p = n / 1000 * c;
    if (k !== null && k > 0) p = Math.min(p, k);
    return Math.round(p * 100) / 100;
  });
}

/**
 * Effective CPM: what you paid per 1,000 views.
 *
 * @param {number} spend Total paid out.
 * @param {number} views Total views.
 * @return Cost per 1,000 views.
 * @customfunction
 */
function CLIPPING_CPM(spend, views) {
  var s = num_(spend, 'spend'), v = num_(views, 'views');
  if (s === null || !v) return '';
  return Math.round(s / v * 1000 * 100) / 100;
}

/**
 * Views needed to reach a payout at a given CPM.
 *
 * @param {number} payout Target payout.
 * @param {number} cpm Payout per 1,000 views.
 * @return Views required.
 * @customfunction
 */
function CLIPPING_VIEWS_NEEDED(payout, cpm) {
  var p = num_(payout, 'payout'), c = num_(cpm, 'cpm');
  if (p === null || !c) return '';
  return Math.ceil(p / c * 1000);
}

/**
 * Campaign budget for a views target.
 *
 * @param {number} target_views Views you want.
 * @param {number} cpm Payout per 1,000 views.
 * @param {number} [platform_fee_pct] Optional fee percent on top, e.g. 10.
 * @return Budget needed.
 * @customfunction
 */
function CLIPPING_BUDGET(target_views, cpm, platform_fee_pct) {
  var t = num_(target_views, 'target_views'), c = num_(cpm, 'cpm'), f = num_(platform_fee_pct, 'platform_fee_pct') || 0;
  if (t === null || c === null) return '';
  return Math.round(t / 1000 * c * (1 + f / 100) * 100) / 100;
}

/** Used by the sidebar. */
function calc(views, cpm, cap) { return CLIPPING_PAYOUT(views, cpm, cap); }
