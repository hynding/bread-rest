Feature: As a RESTful API developer, I want a convenient middleware to supply simple BREAD ingredients to the server

  Scenario: BREAD out of the box
    Given I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    When I instantiate "breadBox"
    And I call and observe "breadBox.api"
    Then the "browse" property contains method: "get" and action: "/box/browse"
    And the "read" property contains method: "get" and action: "/box/:id"
    And the "edit" property contains method: "put" and action: "/box/:id"
    And the "add" property contains method: "post" and action: "/box"
    And the "destroy" property contains method: "delete" and action: "/box/:id"

  Scenario: Collection name for browse
    Given I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option collectionName: "boxes"
    When I instantiate "breadBox"
    And I call and observe "breadBox.api"
    Then the "browse" property contains method: "get" and action: "/boxes"
    And the "read" property contains method: "get" and action: "/box/:id"
    And the "edit" property contains method: "put" and action: "/box/:id"
    And the "add" property contains method: "post" and action: "/box"
    And the "destroy" property contains method: "delete" and action: "/box/:id"

  Scenario: List over browse
    Given I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option browsePathName: "list"
    When I instantiate "breadBox"
    And I call and observe "breadBox.api"
    Then the "browse" property contains method: "get" and action: "/box/list"

  Scenario: Post browse
    Given I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option browseMethod: "post"
    When I instantiate "breadBox"
    And I call and observe "breadBox.api"
    Then the "browse" property contains method: "post" and action: "/box/browse"

  Scenario: Base path for methods
    Given I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option basePath: "cardboard"
    When I instantiate "breadBox"
    And I call and observe "breadBox.api"
    Then the "browse" property contains method: "get" and action: "/cardboard/box/browse"
    And the "read" property contains method: "get" and action: "/cardboard/box/:id"
    And the "edit" property contains method: "put" and action: "/cardboard/box/:id"
    And the "add" property contains method: "post" and action: "/cardboard/box"
    And the "destroy" property contains method: "delete" and action: "/cardboard/box/:id"

  Scenario: Id replacement
    Given I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option identifier: "{id}"
    When I instantiate "breadBox"
    And I call and observe "breadBox.api"
    Then the "browse" property contains method: "get" and action: "/box/browse"
    And the "read" property contains method: "get" and action: "/box/{id}"
    And the "edit" property contains method: "put" and action: "/box/{id}"
    And the "add" property contains method: "post" and action: "/box"
    And the "destroy" property contains method: "delete" and action: "/box/{id}"

  Scenario: Path separation
    Given I will have the RestfulBread instance "breadBox"
    And I give it the option name: "box"
    And I give it the option pathSeparator: "\"
    When I instantiate "breadBox"
    And I call and observe "breadBox.api"
    Then the "browse" property contains method: "get" and action: "\box\browse"
    And the "read" property contains method: "get" and action: "\box\:id"
    And the "edit" property contains method: "put" and action: "\box\:id"
    And the "add" property contains method: "post" and action: "\box"
    And the "destroy" property contains method: "delete" and action: "\box\:id"
