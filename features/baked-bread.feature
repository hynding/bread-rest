Feature: I would like a baked-in feature to serve my BREAD API.
  I should be able to feed an instance of my server application to handle the requests.
  I should be able to include a response service along with my server to respond to requests.
  I should be able to extend the class and create BREAD methods for automated callbacks.
  My responder handler(s) should be able to assume the common routing pattern akin to Express, Restify and Sinatra frameworks.

  Scenario: Common server with a responder object
    Given I have created a common framework server instance
    And I have created a responder object with BREAD functions returning the request method, a space and "Hello, World"
    And I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option server with my server instance
    When I instantiate "breadBox"
    And I make the HTTP "get" request to "/box/browse"
    Then the HTTP response will be "get Hello, World"

  Scenario: Common server with a responder function
    Given I have created a common framework server instance
    And I have created a responder function returning the request method, a space and "Hello, World"
    And I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option server with my server instance
    When I instantiate "breadBox"
    And I make the HTTP "get" request to "/box/browse"
    Then the HTTP response will be "get Hello, World"

  Scenario: Common server by extension automation
    Given I have a class that extends RestfulBread to overwrite BREAD methods returning the request method, a space and "Hello, World"
    And I have created a common framework server instance
    And I will have the RestfulBread extension instance "breadBox"
    And I give it the option name: "box"
    And I give it the option server with my server instance
    When I instantiate "breadBox"
    And I make the HTTP "get" request to "/box/browse"
    Then the HTTP response will be "get Hello, World"