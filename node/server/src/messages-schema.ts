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
            "$ref": "#/definitions/Player"
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
  "definitions": {
    "Player": {
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
  },
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
            "recipient": {
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
                "set_paused"
              ]
            },
            "paused": {
              "type": "boolean"
            },
            "player": {
              "type": "number"
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
            "recipient": {
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
              "anyOf": [
                {
                  "$ref": "#/definitions/GamepadLayout"
                },
                {
                  "enum": [
                    "default",
                    "jump"
                  ],
                  "type": "string"
                }
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
            "recipient": {
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
                "main_menu_opened"
              ]
            }
          },
          "required": [
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
            "recipient": {
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
                "set_buttons"
              ]
            },
            "buttons": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "enabled": {
              "type": "boolean"
            }
          },
          "required": [
            "buttons",
            "enabled",
            "type"
          ]
        }
      ]
    }
  ],
  "definitions": {
    "GamepadLayout": {
      "type": "object",
      "properties": {
        "gridAreas": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "gridColumns": {
          "type": "string"
        },
        "gridRows": {
          "type": "string"
        },
        "buttons": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/GamepadButton"
          }
        }
      },
      "required": [
        "buttons",
        "gridAreas",
        "gridColumns",
        "gridRows"
      ]
    },
    "GamepadButton": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "color": {
          "$ref": "#/definitions/ButtonColor"
        },
        "icon": {
          "$ref": "#/definitions/ButtonIcon"
        }
      },
      "required": [
        "color",
        "icon",
        "name"
      ]
    },
    "ButtonColor": {
      "enum": [
        "blue",
        "green",
        "neon",
        "orange",
        "pink",
        "purple",
        "red",
        "yellow"
      ],
      "type": "string"
    },
    "ButtonIcon": {
      "enum": [
        "flip",
        "go",
        "jump",
        "left",
        "right",
        "signal-left",
        "signal-right",
        "stop"
      ],
      "type": "string"
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
