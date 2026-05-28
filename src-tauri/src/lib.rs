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

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_processes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
