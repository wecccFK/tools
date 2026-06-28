from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    errors = []
    console_msgs = []

    page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: errors.append(f"PAGE ERROR: {err}"))

    print("=== 1. 首页测试 ===")
    page.goto("http://localhost:4322/", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(1500)

    # 检查标题
    title = page.title()
    print(f"标题: {title}")
    assert "Momo工具箱" in title, f"标题错误: {title}"

    # 检查 Hero
    hero = page.locator("h1").first.text_content()
    print(f"H1: {hero}")

    # 检查 footer 邮箱
    email_link = page.locator('a[href^="mailto:"]').all()
    print(f"邮箱链接数量: {len(email_link)}")
    if email_link:
        print(f"邮箱 href: {email_link[0].get_attribute('href')}")

    # 检查 footer 是否有隐私/服务条款/邮箱链接
    privacy_link = page.locator('a[href="/privacy"]').count()
    terms_link = page.locator('a[href="/terms"]').count()
    print(f"隐私政策链接: {privacy_link}, 服务条款链接: {terms_link}")

    # 检查 GitHub 痕迹
    html_content = page.content()
    has_github = "github.com" in html_content or "wecccFK" in html_content.lower()
    print(f"GitHub 痕迹: {has_github}")

    # 检查 AdSense 痕迹
    has_adsense = "adsense" in html_content.lower() or "广告服务" in html_content
    print(f"AdSense 痕迹: {has_adsense}")

    print("\n=== 2. 语言切换测试 ===")
    # 找语言切换按钮
    lang_btn = page.locator("button:has-text('EN'), button:has-text('中')").first
    if lang_btn.count() > 0:
        before_zh = page.locator("h1").first.text_content()
        print(f"切换前 H1: {before_zh}")
        lang_btn.click()
        page.wait_for_timeout(800)
        after_en = page.locator("h1").first.text_content()
        print(f"切换后 H1: {after_en}")
        if before_zh != after_en:
            print("语言切换: 成功")
        else:
            print("语言切换: 未变化")

        # 切换回中文
        lang_btn2 = page.locator("button:has-text('EN'), button:has-text('中')").first
        if lang_btn2.count() > 0:
            lang_btn2.click()
            page.wait_for_timeout(800)
    else:
        print("未找到语言切换按钮")

    print("\n=== 3. 主题切换测试 ===")
    # 找主题切换按钮（按 title 或 aria-label）
    theme_btn = page.locator('button[aria-label*="theme" i], button[title*="主题" i], button[title*="theme" i]').first
    if theme_btn.count() > 0:
        before_theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
        print(f"切换前 data-theme: {before_theme}")
        theme_btn.click()
        page.wait_for_timeout(500)
        after_theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
        print(f"切换后 data-theme: {after_theme}")
    else:
        print("未找到主题切换按钮")

    print("\n=== 4. 搜索弹窗测试 (⌘K) ===")
    page.keyboard.press("Control+k")
    page.wait_for_timeout(500)
    search_dialog = page.locator('[role="dialog"], input[placeholder*="搜索" i], input[placeholder*="search" i]').first
    if search_dialog.count() > 0:
        print("搜索弹窗: 已打开")
        # 测试搜索
        search_input = page.locator('input[placeholder*="搜索" i], input[placeholder*="search" i]').first
        if search_input.count() > 0:
            search_input.fill("json")
            page.wait_for_timeout(500)
            results = page.locator('a[href*="/tool/"]').count()
            print(f"搜索 'json' 结果数: {results}")
        page.keyboard.press("Escape")
        page.wait_for_timeout(300)
    else:
        print("搜索弹窗: 未打开")

    print("\n=== 5. 隐私政策页测试 ===")
    page.goto("http://localhost:4322/privacy/", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(800)
    privacy_title = page.locator("h1").first.text_content()
    print(f"隐私页 H1: {privacy_title}")
    # 检查邮箱链接
    email_on_privacy = page.locator('a[href^="mailto:"]').count()
    print(f"隐私页邮箱链接数: {email_on_privacy}")
    # 检查 Cookie/广告段是否还存在
    privacy_html = page.content()
    has_cookie_section = ">Cookie<" in privacy_html or ">Cookies<" in privacy_html
    has_ad_section = "广告服务" in privacy_html or "Advertising (Possible" in privacy_html
    print(f"Cookie 段落残留: {has_cookie_section}")
    print(f"广告服务段落残留: {has_ad_section}")

    print("\n=== 6. 服务条款页测试 ===")
    page.goto("http://localhost:4322/terms/", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(800)
    terms_title = page.locator("h1").first.text_content()
    print(f"条款页 H1: {terms_title}")
    email_on_terms = page.locator('a[href^="mailto:"]').count()
    print(f"条款页邮箱链接数: {email_on_terms}")

    print("\n=== 7. 工具页测试 (QR Generator) ===")
    page.goto("http://localhost:4322/tool/qr-generator/", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(1500)
    tool_h1 = page.locator("h1").first.text_content()
    print(f"QR 工具页 H1: {tool_h1}")
    # 检查 QR 输入
    qr_input = page.locator('input[type="text"], textarea').first
    if qr_input.count() > 0:
        print("QR 输入框: 存在")
    # 检查是否有 Coming soon
    coming_soon = page.locator("text=Coming soon").count()
    print(f"Coming soon 占位: {coming_soon}")

    print("\n=== 8. 收藏功能测试 ===")
    page.goto("http://localhost:4322/", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(1000)
    star_btn = page.locator('button[aria-label="收藏"], button[aria-label*="star" i]').first
    if star_btn.count() > 0:
        star_btn.click()
        page.wait_for_timeout(500)
        print("收藏按钮: 已点击")
        # 点击收藏分类
        starred_filter = page.locator('button:has-text("收藏"), button:has-text("Starred")').first
        if starred_filter.count() > 0:
            starred_filter.click()
            page.wait_for_timeout(500)
            print("已切换到收藏分类")
    else:
        print("未找到收藏按钮")

    print("\n=== 9. 错误汇总 ===")
    if errors:
        print(f"页面错误 ({len(errors)}):")
        for e in errors[:5]:
            print(f"  - {e}")
    else:
        print("无页面错误")

    failed_console = [m for m in console_msgs if "[error]" in m.lower() or "[warning]" in m.lower()]
    if failed_console:
        print(f"\n控制台 error/warning ({len(failed_console)}):")
        for m in failed_console[:5]:
            print(f"  - {m}")
    else:
        print("无控制台 error/warning")

    browser.close()
    print("\n=== 测试完成 ===")
