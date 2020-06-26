import {Logger} from "./../jsm/asm/logger.js"

function initLogger() {
    Logger.setup("#logbarContent")
}

import {default as asmInit, Assembler, set_panic_hook as asmPanicHook} from './../jsm/asm/assembler.js';
async function initAsm() {
    let wasm = await asmInit();

   asmPanicHook();

    return {
        wasm: wasm,
        asm: new Assembler()
    }
}

import {default as sysInit, System, DeviceId, set_panic_hook as sysPanicHook} from './../jsm/sys/system.js';
async function initSys() {
    let wasm = await sysInit();

    sysPanicHook();

    let sys = new System();

    sys.add_device(DeviceId.Ram, 0, 0x1000);
    sys.add_device(DeviceId.Rom, 0x1000, 0x1000);

    return {
        wasm: wasm,
        sys: sys
    }
}

async function setup() {
    initLogger();

    let asm = await initAsm();
    let sys = await initSys();

    let rom = new Uint8Array(sys.wasm.memory.buffer,
        sys.sys.UNSAFE_device_data_ptr(1),
        sys.sys.device_size(1)
    );

    let editor = document.querySelector("#editor");
    let logContainer = document.querySelector("#logbarContent");
    document.querySelector("#btnBuild").addEventListener("click", function () {
        logContainer.innerHTML = "";


        let rs = asm.asm.assemble(editor.innerText, rom);

        let msg;
        if (rs) {
            msg = "<i class=\"fas fa-check-circle fa-3x uk-text-center oc-cl-green-8 cr-animate\"></i>";
        } else {
            msg = "<i class=\"fas fa-times-circle fa-3x uk-text-center oc-cl-red-8 cr-animate\"></i>";
        }

        UIkit.notification(
            msg,
            {
                pos: 'top-right',
                timeout: 1500
            }
        );
    })

    document.querySelector("#btnReset").addEventListener("click", function () {
        sys.sys.reset_system();

        updateCpuWidget()
    });
    document.querySelector("#btnExecCycle").addEventListener("click", function () {
        sys.sys.tick();

        updateCpuWidget();
    });


    updateCpuWidget(sys.sys.tmp_to_str())

    function updateCpuWidget() {
        document.querySelector("#cpuContainer").innerText = sys.sys.tmp_to_str();
    }
}

setup();
