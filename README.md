# Snowflake

Snowflake is Medium's tool for planning and supporting our engineers' career development. You can read more
about how we use this tool in our [growth framework documentation](https://medium.com/s/engineering-growth-framework).
Our growth tool is hosted [publicly](https://snowflake.medium.com).

![The Lannisters send their regards](https://i.imgur.com/e9DYLBr.png)

## Contributions

You are free to use, change and build on this work to make it useful for your organisation. We will happily consider
unencumbered code contributions to improve functionality, but as this is the actual tool we use within Medium, acceptance is likely to be intentional, and deliberate. Meaning, slow. As such, you may prefer to fork the codebase for your own needs. We will not accept any contributions that modify the text of the application (but, thank you in advance for pointing out any typos).

## Installation

Get yarn if you don’t have it already:

`npm install -g yarn`

Install dependencies:

`yarn`

### Running the dev server

`yarn dev`

### Building

`yarn export`

This will put a static version of the site in `out/`.

## Future work

* Add restricted job title selection and validation.
* Add "see next level" button to allow copy & pasting or reviewing of next level without updating one's status
* Change hash state to store e.g. PLATFORM_ENGINEERING:4 instead of assuming components will always be in the same order
* Add function to export as a table - to clipboard? Generate XLS?
* Add function to export to a central location e.g. DynamoDB or similar

