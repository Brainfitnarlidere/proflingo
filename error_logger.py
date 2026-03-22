from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.headless = True
try:
    driver = webdriver.Chrome(options=options)
    driver.get("http://localhost:8765/")
    for entry in driver.get_log('browser'):
        print(entry)
    driver.quit()
except Exception as e:
    print("Selenium not available")
