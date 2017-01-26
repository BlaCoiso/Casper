
// Module Docs___________________________
// | Name: Eval
// | Type: MODULE
// | Function: Evaluations
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (command == "calc" || command == "calculate") {
            this.calc(message, params);
        } else if (command == "eval" && data.isDev) {
            this.eval(message, params, config, data);
        }
    },
    handles: ["calc", "calculate", "eval"],
    helpMessage: "",
    eval: function (message, params, config, data) {
        let functionToEval = params.join(" ");
        console.log("User " + message.author.username + "#" + message.author.discriminator + " used eval: " + functionToEval);
        try {
            var result = eval(functionToEval);
            if (result && result.toString().toLowerCase().includes(data.client.token.toLowerCase())) result = "Contains bot's token, censored.";
            message.channel.sendMessage("```js\nInput:\n" + functionToEval + "\n\nOutput:\n" + result + "```");
        } catch (err) {
            message.channel.sendMessage("```js\nInput:\n" + functionToEval + "\n\nError:\n" + err.message + "```");
        }
    },
    calc: function (message, params) {
        let expressionToEval = params.join(' ');
        try {
            message.channel.sendMessage("```js\nInput:\n" + expressionToEval + "\n\nOutput:\n" + math.eval(expressionToEval) + "```");
        } catch (err) {
            message.channel.sendMessage("```js\nInput:\n" + expressionToEval + "\n\nError:\n" + err.message + "```");
        }
    }
}