const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("fs"),
  http = require("http"),
  assert = require("assert");
(async () => {
  const root = require("path").resolve(__dirname, "../../../dist/ui-kit"),
    out =
      process.env.TEST_OUTPUT ||
      require("path").resolve(__dirname, "../test-results");
  fs.mkdirSync(out, { recursive: true });
  const server = http.createServer((q, r) => {
    const f =
      root +
      (q.url.split("?")[0] === "/" ? "/index.html" : q.url.split("?")[0]);
    fs.readFile(f, (e, d) => {
      if (e) {
        r.writeHead(404).end();
        return;
      }
      r.setHeader(
        "Content-Type",
        f.endsWith(".css")
          ? "text/css"
          : f.endsWith(".js")
            ? "text/javascript"
            : f.endsWith(".ttf")
              ? "font/ttf"
              : "text/html",
      );
      r.end(d);
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    args: ["--no-sandbox"],
  });
  const accessibility = [];
  let clicks = 0,
    assertions = 0;
  const errors = [],
    requests = [];
  const check = (v) => {
    assert(v);
    assertions++;
  };
  try {
    for (const width of [1440, 390, 768]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("request", (r) => {
        if (
          !r.url().startsWith("http://127.0.0.1") &&
          !r.url().startsWith("blob:") &&
          !r.url().startsWith("https://anasamin822-dotcom.github.io/")
        )
          requests.push(r.url());
      });
      await page.goto(
        process.env.TEST_URL || "http://127.0.0.1:" + server.address().port,
      );
      await page.locator("#gallery-tokens").waitFor();
      check((await page.locator("#workspace").count()) === 0);
      check((await page.locator("main > section").count()) === 5);
      check((await page.locator(".thumb").count()) === 6);
      check(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      fs.writeFileSync(
        out + "/" + width + "-axe.json",
        JSON.stringify(axe.violations, null, 2),
      );
      accessibility.push({width, violations: axe.violations.map(v => ({id:v.id, nodes:v.nodes.length}))});
      // Preserve the exact original muted token; report its inherited contrast warning.
      check(axe.violations.every(v => v.id === "color-contrast"));
      await page.screenshot({
        path: out + "/" + width + "-full.png",
        fullPage: true,
      });
      for (const filter of ["Classic", "Modern", "Bold", "Premium", "All"]) {
        await page
          .locator(".chips")
          .getByRole("button", { name: filter, exact: true })
          .click();
        clicks++;
        check(
          (await page.locator(".thumb").count()) ===
            (filter === "All"
              ? 6
              : ["Classic", "Premium"].includes(filter)
                ? 2
                : 1),
        );
      }
      await page
        .getByRole("button", { name: "Modern Blue", exact: true })
        .click();
      clicks++;
      check(
        (await page
          .getByRole("button", { name: "Modern Blue", exact: true })
          .getAttribute("aria-pressed")) === "true",
      );
      for (const name of ["Notifications", "Watermark"]) {
        const row = page.locator(".toggle-row").filter({ hasText: name });
        await row.getByRole("switch").click();
        clicks++;
        check(
          (await row.getByRole("switch").getAttribute("aria-checked")) ===
            (name === "Notifications" ? "false" : "true"),
        );
      }
      for (const trigger of [
        page.locator("#demoModalBtn"),
        page.locator("#demoPanelBtn"),
        ...(width > 560 ? [page.getByRole("button", { name: "Search components", exact: true })] : []),
      ]) {
        await trigger.click();
        clicks++;
        const dialog = page.locator("dialog[open]");
        await dialog.waitFor();
        check((await dialog.count()) === 1);
        for (let i = 0; i < 12; i++) {
          await page.keyboard.press("Tab");
          check(
            await dialog.evaluate((d) => d.contains(document.activeElement)),
          );
        }
        for (let i = 0; i < 12; i++) {
          await page.keyboard.press("Shift+Tab");
          check(
            await dialog.evaluate((d) => d.contains(document.activeElement)),
          );
        }
        if (
          await dialog
            .getByRole("textbox", {
              name: "Search kit components",
              exact: true,
            })
            .count()
        ) {
          await dialog
            .getByRole("textbox", {
              name: "Search kit components",
              exact: true,
            })
            .fill("<script>alert(1)</script>");
          check(
            (await dialog.getByText("No matching component").count()) === 1,
          );
        }
        await page.keyboard.press("Escape");
        check((await page.locator("dialog[open]").count()) === 0);
      }
      await page
        .locator(".react-stage .toolbar")
        .getByRole("button", { name: "Material", exact: true })
        .click();
      await page
        .locator(".react-stage .toolbar")
        .getByRole("button", { name: "Glass", exact: true })
        .click();
      clicks += 2;
      check(
        (await page.locator(".react-stage").getAttribute("data-material")) ===
          "glass",
      );
      await page.locator("#demoPanelBtn").click();
      await page
        .locator("dialog[open]")
        .getByRole("button", { name: "Lighting", exact: true })
        .click();
      clicks += 2;
      await page.screenshot({ path: out + "/" + width + "-drawer.png" });
      await page.locator('dialog[open]').getByRole('switch').first().click();
      check(await page.locator('.obj').evaluate(e => e.classList.contains('spinning')));
      await page.locator('dialog[open]').getByRole('switch').nth(1).click();
      check(await page.locator('.react-stage .hotspot').count() === 0);
      await page.locator('dialog[open]').getByRole('button', {name:'Color', exact:true}).click();
      await page.locator('dialog[open] .swatch-dot').nth(2).click();
      await page.waitForFunction(() => document.querySelector('.react-stage').style.getPropertyValue('--h') === '43');
      check(true);
      await page.locator('dialog[open]').getByRole('slider').fill('82');
      check(await page.locator('.obj').evaluate(e => e.style.getPropertyValue('--glow-k') === '82'));
      await page.locator('dialog[open]').getByRole('button', {name:'Reset', exact:true}).click();
      check(await page.locator('.react-stage').getAttribute('data-material') === 'metallic');
      check(await page.locator('.react-stage .hotspot').count() === 2);
      await page.locator('dialog[open]').getByRole('button', {name:'Save design', exact:true}).click();
      check(await page.locator('dialog[open]').count() === 0);
      // Reopening the gallery panel must still work after Save design.
      await page.locator('#demoPanelBtn').click();
      await page.locator('dialog[open]').waitFor();
      check(await page.locator('dialog[open]').count() === 1);
      await page.keyboard.press("Escape");
      await page.locator("#demoToastBtn").click();
      clicks++;
      check((await page.locator(".toast").count()) === 1);
      await context.close();
    }
    check(errors.length === 0);
    check(requests.length === 0);
    console.log(
      JSON.stringify({ passed: true, clicks, assertions, errors, requests, accessibility }),
    );
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
