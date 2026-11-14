import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Uygulamayı internet olmadan açar: dosyalar diskten, Supabase sahte sürümle gelir.
export const ROOT = path.join(__dirname, '..', '..');
const FAKE = fs.readFileSync(path.join(__dirname, 'fake-supabase.js'), 'utf8');
export const APP = 'http://app/index.html';

export type AppHandle = { errors: string[]; n8n: Record<string, string>[] };

export async function setupApp(page: Page, opts: { confirm?: boolean } = {}): Promise<AppHandle> {
  const h: AppHandle = { errors: [], n8n: [] };
  page.on('pageerror', e => h.errors.push(e.message));
  await page.context().route('**/*', route => {
    const url = route.request().url();
    if (url.includes('supabase-js') || url.endsWith('/js/vendor/supabase.js')) {
      return route.fulfill({ body: FAKE, contentType: 'application/javascript' });
    }
    if (url.includes('n8n')) { h.n8n.push(route.request().headers()); return route.fulfill({ status: 200, body: '{}' }); }
    if (url.startsWith('http://app/')) {
      const file = path.join(ROOT, decodeURIComponent(url.slice('http://app/'.length).split('?')[0]));
      return fs.existsSync(file) ? route.fulfill({ path: file }) : route.fulfill({ status: 404, body: '' });
    }
    return route.fulfill({ status: 204, body: '' }); // dış istekler (font, sözlük vb.) kapalı
  });
  await page.goto(APP);
  await page.evaluate(cfg => {
    localStorage.clear();
    localStorage.setItem('lv_target_lang', 'en');
    localStorage.setItem('lv_onboard_seen', '1');
    localStorage.setItem('__fake_cfg', JSON.stringify(cfg));
  }, { confirm: opts.confirm ?? true });
  await boot(page);
  return h;
}

// Sayfayı yeniden açar ve açılış animasyonunu bekler.
export async function boot(page: Page) {
  await page.goto(APP);
  await page.waitForTimeout(1600);
}

export async function register(page: Page, email = 'test@example.com', password = 'secret1') {
  await page.click('#go-register');
  await page.fill('#reg-name', 'Test Kişi');
  await page.fill('#reg-email', email);
  await page.fill('#reg-password', password);
  await page.click('#reg-phone');
  await page.keyboard.type('551112233'); // alan "05" ile başlar
  await page.check('#reg-kvkk');
  await page.click('#btn-register');
  await page.waitForTimeout(500);
}

export const serverProfile = (page: Page) =>
  page.evaluate(() => Object.values((window as any).__FAKE.profiles)[0] as any);
