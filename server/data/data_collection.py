import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.expected_conditions import staleness_of
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

from ..config import secrets, config


def get_driver():
    options = Options()
    # options.add_argument("--headless")
    driver = webdriver.Chrome(ChromeDriverManager().install(),
                              options=options)
    return driver


def get_player_data(row):
    if row is None:
        return

    # Store data for player we are processing
    player = dict()
    row_data = row.find_elements_by_tag_name("td")
    for i, td in enumerate(row_data):
        # We'll just use the index to figure out which col we're dealing with
        if i == 0:
            player["position"] = td.find_element_by_tag_name("span").text
        elif i == 1:
            player["name"] = td.find_element_by_class_name("_3UoaUQHA1QwMJfwX5dokfV").text
            player["salary"] = td.find_element_by_tag_name("span").text
        elif i == 2:
            player["owned"] = td.find_element_by_class_name("_29y79o37IFFnfy8adWNjgV").text
        elif i == 5:
            player["points"] = td.find_element_by_css_selector("span[class=_3kOg9kHyBI5HxiKfHlmwiZ] > span").text

    return player


def main():
    driver = get_driver()
    driver.get(config.LEAGUE_URL)

    # 1) Navigate to Login page
    try:
        login_button = driver.find_element_by_css_selector("[data-test-id=registration-link]")
        print(login_button)
    except NoSuchElementException as e:
        print(e)
        exit(1)
    login_button.click()

    # 2) Enter Login info
    try:
        username_input = driver.find_element_by_css_selector("[data-test-id=username-input]")
        username_input.send_keys(secrets.DK_USERNAME)
        password_input = driver.find_element_by_css_selector("[type=password]")
        password_input.send_keys(secrets.DK_PASSWORD)
    except NoSuchElementException as e:
        print(e)
        exit(1)

    # Get reference to current HTML - will check when this becomes stale in order to determine
    # that login is complete
    login_page = driver.find_element_by_tag_name("html")

    # 3) Press login button
    try:
        login_button = driver.find_element_by_css_selector("[data-test-id=login-input]")
    except NoSuchElementException as e:
        print(e)
        exit(1)
    login_button.click()

    # 4) Wait to be redirected to league page
    WebDriverWait(driver, 30).until(
        staleness_of(login_page)
    )

    # Wait for needed page elements to render
    view_results_selector = "a[class='_3HK8KxCG5YVXeIajdbhO8S _3mZ9ga1S8SdbKoe_2w2oWv _3zsZiSgfe7t24N3I4xkVOI']"
    WebDriverWait(driver, 30).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, view_results_selector))
    )
    # Get "View Results" anchor tag for each week
    results_anchor = driver.find_elements_by_css_selector(view_results_selector)
    # TODO: move this logic to separate fcn.
    for a in results_anchor:
        # Navigate to Results page for given week
        a.click()

        # Wait for Results page to load
        teams_table_selector = "div[class=ReactVirtualized__Grid__innerScrollContainer] > div"
        WebDriverWait(driver, 30).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, teams_table_selector))
        )

        # If popup modal appears, close it first
        try:
            popup_close_btn = driver.find_element_by_css_selector("[data-testid=modal-close-icon]")
            popup_close_btn.click()
        except NoSuchElementException as e:
            print(e)

        # Click through each team and save their lineups
        teams = driver.find_elements_by_css_selector(teams_table_selector)
        all_team_data = dict()
        # We will manually keep up with week totals instead of scraping page to find it
        current_week = 14
        for team in teams:
            # Init object that will store each team's data for the week
            current_week_key = "week_" + str(current_week)
            all_team_data[current_week_key] = []
            current_week -= 1
            # Create obj to store data for this team
            team_data = dict()
            team_data["name"] = team.find_element_by_class_name("_3ASiVpv9WeTxdZXplZmdEC").text
            print(team_data["name"])
            # Click team to update table of players
            team.click()
            # Ensure table has updated before proceeding - currently doing this by checking when
            # loading spinner disappears
            try:
                WebDriverWait(driver, 30).until(
                    EC.invisibility_of_element((By.CLASS_NAME, "dk-spinner"))
                )
            except NoSuchElementException as e:
                print(e)

            # Create array of player objs for this team
            team_data["lineup"] = []
            table_rows = driver.find_elements_by_css_selector("tbody tr")
            # Each row represents an individual player; process row and add to list
            for row in table_rows:
                player_data = get_player_data(row)
                if player_data is not None:
                    team_data["lineup"].append(player_data)

            # Add this team's data to list of team data for the current week
            all_team_data[current_week_key].append(team_data)

    all_team_data_dict = dict()
    all_team_data_dict["weekly_data"] = all_team_data
    all_team_data_json = json.dumps(all_team_data_dict, indent=4)
    # Save JSON to file
    with open("weekly_data.json", "w") as file:
        file.write(all_team_data_json)


main()
