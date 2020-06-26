export class Logger {
    static baseNode;
    static workingNode;
    static writeNode;
    static currentLine;

    static handled;

    static setup(selector) {
        this.baseNode = document.querySelector(selector);

        this.reset();
    }

    static reset() {
        this.workingNode = null;
        this.writeNode = null;
        this.currentLine = -1;

        this.handled = false;
    }

    static setCurrentLine(line) {
        this.currentLine = line;
    }


    static beginGeneric(msgClass) {
        let template = `
        <div class="alert cr-${msgClass}">
            <div></div>
        </div>
        `;

        let node = document.createElement("div");
        node.innerHTML = template;

        this.workingNode = node;
        this.writeNode = node.querySelector(".alert div");

        if (this.currentLine) {
            let b = document.createElement("b");

            b.innerText = (!isNaN(this.currentLine) ? "Ln " : "") + this.currentLine + ":";

            this.writeNode.appendChild(b);
        }

    }

    static beginInfo() {
        this.beginGeneric("info");
    }

    static beginWarn() {
        this.beginGeneric("warn");
    }

    static beginErr() {
        this.beginGeneric("err");
    }

    static write(obj) {
        let node = document.createElement("span");
        node.innerText = obj;

        this.writeNode.appendChild(node);
    }

    static writeCode(msg) {
       let node = document.createElement("code");
        node.innerText = msg;

        this.writeNode.appendChild(node);

    }

    static endMessage() {
        if (this.workingNode) {
            this.baseNode.appendChild(this.workingNode);

            this.workingNode = null;
            this.writeNode = null;
        }

        this.handled = true;
    }

    static genericMessage(kind, msg) {
        Logger.beginGeneric(kind);
        Logger.write(msg);
        Logger.endMessage();
    }

    static genericExplainedCode(kind, msg1, err, msg2) {
        Logger.beginGeneric(kind);
        Logger.write(msg1);
        Logger.writeCode(err);
        Logger.write(msg2);
        Logger.endMessage();
    }

    static msgHandled() {
        let handled = this.handled;

        this.handled = false;

        return handled;
    }

}