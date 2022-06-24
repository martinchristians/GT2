// generated file! do not edit!
import { Schema } from "jsonschema"
export const schemaServerMessage: Schema = {
  "anyOf": [
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "room_created"
          ]
        },
        "room_code": {
          "type": "string"
        }
      },
      "required": [
        "room_code",
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "player_joined"
          ]
        },
        "id": {
          "type": "number"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "name",
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "player_left"
          ]
        },
        "id": {
          "type": "number"
        }
      },
      "required": [
        "id",
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "game_disconnected"
          ]
        }
      },
      "required": [
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "list_players"
          ]
        },
        "players": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "number"
              },
              "name": {
                "type": "string"
              }
            },
            "required": [
              "id",
              "name"
            ]
          }
        }
      },
      "required": [
        "players",
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "invalid_message"
          ]
        },
        "code": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      },
      "required": [
        "code",
        "message",
        "type"
      ]
    }
  ],
  "$schema": "http://json-schema.org/draft-07/schema#"
}

export const schemaClientMessage: Schema = {
  "anyOf": [
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "request_pause"
          ]
        },
        "pause": {
          "type": "boolean"
        }
      },
      "required": [
        "pause",
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "return_to_menu"
          ]
        }
      },
      "required": [
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "start_level"
          ]
        },
        "level": {
          "type": "number"
        }
      },
      "required": [
        "level",
        "type"
      ]
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "button_pressed"
          ]
        },
        "button": {
          "type": "string"
        },
        "pressed": {
          "type": "boolean"
        }
      },
      "required": [
        "button",
        "pressed",
        "type"
      ]
    }
  ],
  "$schema": "http://json-schema.org/draft-07/schema#"
}

export const schemaGameMessage: Schema = {
  "anyOf": [
    {
      "allOf": [
        {
          "type": "object",
          "properties": {
            "recepient": {
              "type": "number"
            }
          }
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "game_paused"
              ]
            },
            "paused": {
              "type": "boolean"
            }
          },
          "required": [
            "paused",
            "type"
          ]
        }
      ]
    },
    {
      "allOf": [
        {
          "type": "object",
          "properties": {
            "recepient": {
              "type": "number"
            }
          }
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "level_started"
              ]
            },
            "layout": {
              "type": "string",
              "enum": [
                "default"
              ]
            }
          },
          "required": [
            "layout",
            "type"
          ]
        }
      ]
    },
    {
      "allOf": [
        {
          "type": "object",
          "properties": {
            "recepient": {
              "type": "number"
            }
          }
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "enable_button"
              ]
            },
            "button": {
              "type": "string"
            },
            "enabled": {
              "type": "boolean"
            }
          },
          "required": [
            "button",
            "enabled",
            "type"
          ]
        }
      ]
    }
  ],
  "$schema": "http://json-schema.org/draft-07/schema#"
}
