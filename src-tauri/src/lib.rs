use std::ffi::OsStr;

#[tauri::command]
fn get_processes() -> Vec<String> {
    let mut processes = Vec::new();
    let mut sys = sysinfo::System::new_all();
    sys.refresh_all();
    for (pid, process) in sys.processes() {
        let name = process.name().to_string_lossy().to_string();
        let cmd = process.cmd().join(OsStr::new(" ")).to_string_lossy().to_string();
        processes.push(format!("{}|{}|{}", pid, name, cmd));
    }
    processes
}

#[tauri::command]
fn quit_app(app: tauri::AppHandle) {
    app.exit(0);
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_processes, quit_app])
        .setup(|app| {
            let _widget = tauri::WebviewWindowBuilder::new(
                app,
                "widget",
                tauri::WebviewUrl::App("widget.html".into()),
            )
            .title("AgentWatch Widget")
            .inner_size(300.0, 200.0)
            .decorations(false)
            .transparent(true)
            .always_on_top(true)
            .visible_on_all_workspaces(true)
            .skip_taskbar(true)
            .resizable(false)
            .build()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
