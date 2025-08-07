import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Listen for and print any JavaScript console messages
    page.on("console", lambda msg: print(f"Browser Console: {msg.type} >> {msg.text}"))

    # Navigate to the local HTML file
    page.goto("file:///app/index.html")

    # Wait for the game container to be visible
    game_container = page.locator("#game-container")
    expect(game_container).to_be_visible()

    # Wait for the canvas to be specifically rendered by p5.js
    canvas = game_container.locator("canvas")
    expect(canvas).to_be_visible(timeout=10000) # Increased timeout

    # Wait for the instruction text to be updated by the script
    expect(page.locator("#instruction-text")).to_have_text(re.compile(r"Find the number: \d+"))

    # Take a screenshot of the game container
    page.screenshot(path="jules-scratch/verification/initial_game_state.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
