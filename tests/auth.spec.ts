import { test, expect } from '@playwright/test';
import { setupApp, boot, register, serverProfile } from './helpers/app';

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
