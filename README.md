# Snowflake (new name needed)

This is our ladder tool. It is to help us support and grow our collective capabilities. It has been forked and modified
from "Snowflake", which was Medium's tool for planning and supporting their engineers' career development.

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

## How it works

This version is fed by JSON files. One for each role. A role may be Platform Engineering, Quality Engineer, Scrum Mastering, anything you like.

Each role exists as a root JSON file in `static/roles`. The files needed here are:

 * `<role-name>.json`
 * `<role-name>-titles.json`

### role-name.json

This it the main file and describes which "tracks" make up this role. It is *strongly* recommended that you include the
same set of "mandatory" components as most other roles - these are skills, behaviours and customer understanding we
believe are fundamental to our success. Everyone should be trying to improve in these areas, from the newest joiner to
the most experienced CTO.

This file looks a bit like this:

```
{
    "OWNERSHIP":{
        "location":"/static/tracks/mandatory/ownership.json"
    },
    "CLOUD":{
        "location":"/static/tracks/mandatory/cloud.json"
    },
    "EXTREME":{
        "location":"/static/tracks/mandatory/extreme.json"
    },

    "PLATFORM_ENGINEERING":{
        "location":"/static/tracks/platform-engineering/platform-engineering.json"
    }
}
```

Notice that each "track" consists of a key and a location.

* key: must be unique across all roles
* location: must point to a file inside the `static/tracks/` directory tree.

It is recommended that we group track files logically, those pertinent to everyone in the "mandatory" folder, those
pertinent to only Platform Engineering in the   `platform-engineering` folder, those pertinent to all engineers
(Quality, Platform, etc) in their own folder, etc. This aids us in reviewing changes as it helps to know which people
to pull in to review.

### <role-name>-titles.json

This file describes how the tool should tie tracks to role titles in terms of points and the number required to
progress. It also describes the maximum possible points for this role.

This file is structured like so, description inline:

```
{
    // Must be unique across all roles
    "CLOUD":{
        "displayName":"Cloud",

        // This can be the same as other tracks - tracks with identical categories will use the same colour
        "category":"MANDATORY",
        "description":"Understands the relevance of Cloud",
        "milestones":[

            // Repeated up to 5 times for a total of 5 milestones
            {
                "summary":"Summary of this milestone",
                "signals":[

                    // No limit to the number of lines but be sensible
                    "Things that one must show to achieve this milestone"
                ],
                "examples":[

                  // No limit to the number of lines but be sensible
                  "Example behaviours, achievements, understandings"
                ]
            },
        ]
    }
}

```

## Future work

* Update logo
* Tests!
* Add function to export as a table - to clipboard? Generate XLS? - Need to understand use case
* Add function to export to a central location e.g. DynamoDB or similar - Need to understand use case
