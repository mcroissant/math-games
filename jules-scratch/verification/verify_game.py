import asyncio
from playwright.sync_api import sync_playwright, expect, Page
import pathlib

def verify_game(page: Page):
    """
    This script verifies the core functionality of the Caterpillar Math Game.
    1. Loads the game.
    2. Takes a screenshot of the initial state.
    3. Finds the leaf with the correct number (2).
    4. Clicks the correct leaf.
    5. Verifies that the score updates.
    6. Takes a screenshot of the new state.
    """
    # Get the absolute path to the index.html file
    file_path = pathlib.Path(__file__).parent.parent.parent.joinpath("index.html").resolve()

    # 1. Arrange: Go to the game page.
    page.goto(f"file://{file_path}")

    # 2. Screenshot initial state
    initial_screenshot_path = pathlib.Path(__file__).parent.joinpath("verification_initial.png")
    page.screenshot(path=str(initial_screenshot_path))
    print(f"Initial screenshot saved to {initial_screenshot_path}")

    # 3. Act: Find and click the correct leaf
    # The first number to find is always 2. We need to get its coordinates from the canvas.
    correct_leaf_coords = page.evaluate("""() => {
        const correctLeaf = window.leaves.find(leaf => leaf.num === window.nextNumber);
        return correctLeaf ? { x: correctLeaf.x, y: correctLeaf.y } : null;
    }""")

    if not correct_leaf_coords:
        raise Exception("Could not find the correct leaf on the canvas.")

    print(f"Found correct leaf at coordinates: {correct_leaf_coords}")

    # Get canvas position to click relative to the page
    canvas_box = page.locator("#game-canvas").bounding_box()
    click_x = canvas_box['x'] + correct_leaf_coords['x']
    click_y = canvas_box['y'] + correct_leaf_coords['y']

    page.mouse.click(click_x, click_y)

    # 4. Assert: Check if the score updated
    score_display = page.locator("#score-display")
    expect(score_display).to_have_text("Length: 2")

    instruction_text = page.locator("#instruction-text")
    expect(instruction_text).to_have_text("Find the number 3!")

    print("Score and instruction text updated successfully.")

    # 5. Screenshot final state
    final_screenshot_path = pathlib.Path(__file__).parent.joinpath("verification_final.png")
    page.screenshot(path=str(final_screenshot_path))
    print(f"Final screenshot saved to {final_screenshot_path}")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_game(page)
        browser.close()

if __name__ == "__main__":
    main()
