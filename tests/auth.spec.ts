import { test, expect } from '@playwright/test';
import { setupApp, boot, register, serverProfile, APP } from './helpers/app';

test.describe('Giriş ve kayıt', () => {
  test('kayıt → onay kodu → ana ekran, oturum yenilemede korunur', async ({ page }) => {
    const app = await setupApp(page);
    await expect(page.locator('#form-login')).toBeVisible();
    await register(page);
    await expect(page.locator('#form-verify')).toBeVisible();      // eski hata: görünmüyordu
    await expect(page.locator('#form-register')).toBeHidden();

    const profile = await serverProfile(page);
    expect(JSON.stringify(profile)).not.toContain('password');    // şifre profile yazılmaz
    expect(await page.evaluate(() => Object.values((window as any).__FAKE.users)[0].user_metadata.phone))
      .toBe('05551112233');

    await page.fill('#verify-code', '000000');
    await page.click('#btn-verify-confirm');
    await expect(page.locator('#verify-error')).toContainText('hatalı');

    await boot(page);                                                // yenileyince onay ekranı hatırlanır
    await expect(page.locator('#form-verify')).toBeVisible();
    await page.fill('#verify-code', '123456');
    await page.click('#btn-verify-confirm');
    await expect(page.locator('#screen-home')).toBeVisible();

    await boot(page);
    await expect(page.locator('#screen-home')).toBeVisible();
    expect(app.errors).toEqual([]);
  });

  test('yanlış şifre, doğru şifre, aynı e-postayla tekrar kayıt, çıkış', async ({ page }) => {
    const app = await setupApp(page, { confirm: false });
    await register(page);
    await expect(page.locator('#screen-home')).toBeVisible();

    await page.evaluate(() => document.getElementById('btn-logout')!.click());
    await page.waitForTimeout(300);
    await boot(page);
    await expect(page.locator('#form-login')).toBeVisible();

    await page.fill('#login-email', 'test@example.com');
    await page.fill('#login-password', 'yanlis1');
    await page.click('#btn-login');
    await expect(page.locator('#login-error')).toContainText('E-posta veya şifre hatalı');

    await page.fill('#login-password', 'secret1');
    await page.click('#btn-login');
    await expect(page.locator('#screen-home')).toBeVisible();

    await page.evaluate(() => document.getElementById('btn-logout')!.click());
    await page.waitForTimeout(300);
    await boot(page);
    await register(page);
    await expect(page.locator('#reg-error')).toContainText('zaten kayıtlı');
    expect(app.errors).toEqual([]);
  });

  test('şifremi unuttum: kod + yeni şifre, sonra yeni şifreyle giriş', async ({ page }) => {
    const app = await setupApp(page, { confirm: false });
    await register(page);
    await page.evaluate(() => document.getElementById('btn-logout')!.click());
    await page.waitForTimeout(300);
    await boot(page);

    await page.fill('#login-email', 'Test@Example.com ');
    await page.click('#go-forgot');
    await expect(page.locator('#form-forgot')).toBeVisible();
    await expect(page.locator('#form-login')).toBeHidden();
    await expect(page.locator('#forgot-email')).toHaveValue('Test@Example.com');
    await page.click('#btn-forgot-send');
    await expect(page.locator('#form-reset')).toBeVisible();
    await expect(page.locator('#reset-code-field')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__FAKE.calls.find((c: any) => c.reset)?.reset)).toBe('test@example.com');

    await page.fill('#reset-code', '000000');
    await page.fill('#reset-password', 'yeni123');
    await page.click('#btn-reset-confirm');
    await expect(page.locator('#reset-error')).toContainText('hatalı');

    await page.fill('#reset-code', '123456');
    await page.click('#btn-reset-confirm');
    await expect(page.locator('#screen-home')).toBeVisible();

    await page.evaluate(() => document.getElementById('btn-logout')!.click());
    await page.waitForTimeout(300);
    await boot(page);
    await page.fill('#login-email', 'test@example.com');
    await page.fill('#login-password', 'secret1');
    await page.click('#btn-login');
    await expect(page.locator('#login-error')).toContainText('E-posta veya şifre hatalı');
    await page.fill('#login-password', 'yeni123');
    await page.click('#btn-login');
    await expect(page.locator('#screen-home')).toBeVisible();
    expect(app.errors).toEqual([]);
  });

  test('e-postadaki sıfırlama linkiyle gelince sadece yeni şifre sorulur', async ({ page }) => {
    const app = await setupApp(page, { confirm: false });
    await register(page);                                   // linkten gelen oturumu taklit eder
    await page.goto('about:blank');
    await page.goto(APP + '#access_token=x&type=recovery');
    await page.waitForTimeout(1800);
    await expect(page.locator('#form-reset')).toBeVisible();
    await expect(page.locator('#reset-code-field')).toBeHidden();
    await expect(page.locator('#screen-home')).toBeHidden();
    await page.fill('#reset-password', 'linkle99');
    await page.click('#btn-reset-confirm');
    await expect(page.locator('#screen-home')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__FAKE.users['test@example.com'].password)).toBe('linkle99');
    expect(app.errors).toEqual([]);
  });

  test('8 haneli onay kodu da kabul edilir', async ({ page }) => {
    await setupApp(page);
    await page.evaluate(() => { const c = JSON.parse(localStorage.getItem('__fake_cfg')!); c.otp = '12345678'; localStorage.setItem('__fake_cfg', JSON.stringify(c)); });
    await page.evaluate(() => localStorage.removeItem('__fake_db'));
    await boot(page);
    await register(page);
    await expect(page.locator('#form-verify')).toBeVisible();
    await page.fill('#verify-code', '12345678');
    await page.click('#btn-verify-confirm');
    await expect(page.locator('#screen-home')).toBeVisible();
  });

  test('KVKK, gizlilik, çerez ve kullanım koşulları bağlantıları gerçek sayfaları yeni sekmede açar', async ({ page }) => {
    await setupApp(page);
    await page.click('#go-register');
    const linkler = await page.evaluate(() => [...document.querySelectorAll('label[for=reg-kvkk] a, .footer-link')]
      .map(a => ({ href: a.getAttribute('href'), target: a.getAttribute('target') })));
    expect(linkler.map(l => l.href)).toEqual(['kvkk.html', 'gizlilik.html', 'kullanim-kosullari.html', 'cerez.html', 'kullanim-kosullari.html']);
    expect(linkler.every(l => l.target === '_blank')).toBe(true);
    const [yeni] = await Promise.all([page.context().waitForEvent('page'), page.click('label[for=reg-kvkk] a[href="kvkk.html"]')]);
    await yeni.waitForLoadState();
    await expect(yeni.locator('h1')).toHaveText('KVKK Aydınlatma Metni');
    await expect(yeni.locator('body')).toContainText('Veri Sorumlusu');
    await expect(page.locator('#form-register')).toBeVisible();          // kayıt formu kaybolmaz
    expect(await page.isChecked('#reg-kvkk')).toBe(false);               // bağlantıya tıklamak onay vermez
    for (const s of ['gizlilik.html', 'cerez.html', 'kullanim-kosullari.html']) {
      await yeni.goto('http://app/' + s);
      await expect(yeni.locator('h1')).not.toBeEmpty();
      await expect(yeni.locator('.yasal-nav a')).toHaveCount(4);
    }
  });

  test('Supabase oturumu olmayan eski yerel kayıt içeri alınmaz', async ({ page }) => {
    await setupApp(page);
    await page.evaluate(() => localStorage.setItem('lv_curr_user', JSON.stringify({ id: 'eski', name: 'Eski', xp: 5 })));
    await boot(page);
    await expect(page.locator('#form-login')).toBeVisible();
    await expect(page.locator('#screen-home')).toBeHidden();
  });

  test('profil yüklenemezse önbellekteki XP korunur', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    await page.evaluate(() => {
      const F = (window as any).__FAKE; const p: any = Object.values(F.profiles)[0]; p.xp = 40;
      localStorage.setItem('__fake_db', JSON.stringify({ ...JSON.parse(localStorage.getItem('__fake_db')!), profiles: F.profiles, failProfile: true }));
      const u = (window as any).getCurrentUser(); u.xp = 40; (window as any).saveCurrentUser(u);
    });
    await boot(page);
    expect(await page.evaluate(() => (window as any).getCurrentUser()?.xp)).toBe(40);
  });

  test('giriş zamanı ve aktif süre kaydı: kayıtta "giris", açılışta "acilis", sinyal ve çıkış', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    await page.waitForTimeout(300);
    const oturumlar = () => page.evaluate(() => (window as any).__FAKE.oturumlar || []);
    expect((await oturumlar()).map((o: any) => o.tur)).toEqual(['giris']);

    await boot(page);                                   // uygulamayı kayıtlı oturumla tekrar aç
    await page.waitForTimeout(300);
    expect((await oturumlar()).map((o: any) => o.tur)).toEqual(['giris', 'acilis']);

    await page.evaluate(() => (window as any).Oturum.nabiz(true));
    await page.waitForTimeout(100);
    expect((await oturumlar())[1].nabiz).toBe(1);       // aktiflik sinyali doğru oturuma gitti

    await page.evaluate(() => { (window as any).Oturum.lastInput = Date.now() - 10 * 60 * 1000; return (window as any).Oturum.nabiz(); });
    expect((await oturumlar())[1].nabiz).toBe(1);       // 10 dk dokunulmadıysa sinyal gitmez

    await page.evaluate(() => document.getElementById('btn-logout')!.click());
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => (window as any).Oturum.id)).toBeNull();   // çıkışta durur
  });
});
