/**
 * Google Apps Script Web App — приёмник лид-формы.
 *
 * УСТАНОВКА (кратко, подробно — в DOCUMENTATION.md):
 *   1. Создать Google Sheet.
 *   2. Extensions → Apps Script, вставить этот файл.
 *   3. Заполнить CONFIG ниже (SPREADSHEET_ID можно оставить пустым,
 *      если скрипт привязан к таблице).
 *   4. Deploy → New deployment → Web app:
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Скопировать URL вида https://script.google.com/macros/s/…/exec
 *      и положить его в .env фронтенда: VITE_SHEETS_ENDPOINT=…
 *
 * Google credentials на фронтенде НЕ хранятся: фронт знает только этот URL.
 */

var CONFIG = {
  // ID таблицы из её URL: /spreadsheets/d/<ID>/edit
  // Пусто = использовать таблицу, к которой привязан скрипт.
  SPREADSHEET_ID: '1PWeZSQxKKBASb3b-vWZ6VZl-LPHfOAdDlMXAT9bKU_A',

  // Имя листа. Если листа нет, он будет создан с заголовками.
  SHEET_NAME: 'Leads',

  // Общий секрет. Должен совпадать с VITE_SHEETS_TOKEN на фронтенде.
  // Пустая строка = проверка отключена.
  SHARED_TOKEN: '',

  // Куда слать уведомление о новом лиде. Пусто = не слать.
  NOTIFY_EMAIL: '',
};

var HEADERS = [
  'Timestamp',
  'First Name',
  'Last Name',
  'Email',
  'Country',
  'Country Code',
  'Phone',
  'Investment Experience',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'Page URL',
  'Referrer',
  'User Agent',
];

/** POST от формы. Тело приходит как text/plain с JSON внутри. */
function doPost(e) {
  try {
    var data = parseBody(e);

    if (CONFIG.SHARED_TOKEN && data.token !== CONFIG.SHARED_TOKEN) {
      return jsonResponse({ result: 'error', error: 'Unauthorized' });
    }

    var sheet = getSheet();

    sheet.appendRow([
      data.submittedAt ? new Date(data.submittedAt) : new Date(),
      str(data.firstName),
      str(data.lastName),
      str(data.email),
      str(data.country),
      str(data.countryCode),
      // Апостроф не даёт таблице превратить "+1 555…" в формулу/число
      data.phone ? "'" + str(data.phone) : '',
      str(data.experience),
      str(data.utm_source),
      str(data.utm_medium),
      str(data.utm_campaign),
      str(data.utm_term),
      str(data.utm_content),
      str(data.pageUrl),
      str(data.referrer),
      str(data.userAgent),
    ]);

    notify(data);

    return jsonResponse({ result: 'success' });
  } catch (error) {
    return jsonResponse({ result: 'error', error: String(error && error.message ? error.message : error) });
  }
}

/** GET — простая проверка, что деплой живой (откройте URL в браузере). */
function doGet() {
  return jsonResponse({ result: 'success', message: 'Lead endpoint is running' });
}

/** Разбор тела запроса: JSON в text/plain или обычная form-data. */
function parseBody(e) {
  if (!e) return {};

  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignored) {
      // не JSON — пробуем параметры формы ниже
    }
  }

  var params = {};
  if (e.parameter) {
    for (var key in e.parameter) {
      params[key] = e.parameter[key];
    }
  }
  return params;
}

/** Лист с заголовками. Создаётся автоматически при первом запуске. */
function getSheet() {
  var book = CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!book) {
    throw new Error('Spreadsheet not found. Set CONFIG.SPREADSHEET_ID.');
  }

  var sheet = book.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(CONFIG.SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/** Необязательное письмо о новом лиде. */
function notify(data) {
  if (!CONFIG.NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(
      CONFIG.NOTIFY_EMAIL,
      'New lead: ' + str(data.firstName) + ' ' + str(data.lastName),
      [
        'Name: ' + str(data.firstName) + ' ' + str(data.lastName),
        'Email: ' + str(data.email),
        'Phone: ' + str(data.phone),
        'Country: ' + str(data.country),
        'Experience: ' + str(data.experience),
        'Campaign: ' + str(data.utm_campaign),
        'Source: ' + str(data.utm_source),
        'Page: ' + str(data.pageUrl),
      ].join('\n'),
    );
  } catch (ignored) {
    // Письмо не должно ломать запись строки в таблицу
  }
}

function str(value) {
  return value === undefined || value === null ? '' : String(value);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
