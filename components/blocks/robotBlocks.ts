import * as Blockly from "blockly";

export function registerRobotBlocks() {
  // Move Joint block (for each joint)
  Blockly.Blocks["move_joint"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("move joint")
        .appendField(
          new Blockly.FieldDropdown([
            ["Base", "base"],
            ["Shoulder", "shoulder"],
            ["Elbow", "elbow"],
            ["Wrist Pitch", "wrist_pitch"],
            ["Wrist Roll", "wrist_roll"],
            ["Gripper", "gripper"],
          ]),
          "JOINT"
        )
        .appendField("to")
        .appendField(new Blockly.FieldNumber(0, -180, 180, 1), "ANGLE")
        .appendField("degrees");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Move a joint to a specific angle");
      this.setHelpUrl("");
    },
  };

  // Open Gripper
  Blockly.Blocks["open_gripper"] = {
    init: function () {
      this.appendDummyInput().appendField("open gripper");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Open the gripper");
      this.setHelpUrl("");
    },
  };

  // Close Gripper
  Blockly.Blocks["close_gripper"] = {
    init: function () {
      this.appendDummyInput().appendField("close gripper");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Close the gripper");
      this.setHelpUrl("");
    },
  };

  // Wait block
  Blockly.Blocks["wait_seconds"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("wait")
        .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), "SECONDS")
        .appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(60);
      this.setTooltip("Wait for a number of seconds");
      this.setHelpUrl("");
    },
  };

  // Repeat block
  Blockly.Blocks["repeat_times"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("repeat")
        .appendField(new Blockly.FieldNumber(3, 1, 10, 1), "TIMES")
        .appendField("times");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(300);
      this.setTooltip("Repeat the enclosed blocks");
      this.setHelpUrl("");
    },
  };
}
