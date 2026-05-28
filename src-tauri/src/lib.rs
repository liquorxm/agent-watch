use std::ffi::OsStr;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn get_config_path(app: &tauri::AppHandle) -> PathBuf {
    let mut path = app.path().app_config_dir().unwrap_or_default();
    fs::create_dir_all(&path).ok();
    path.push("config.json");
    path
}

#[tauri::command]
fn load_config(app: tauri::AppHandle) -> Result<String, String> {
    let path = get_config_path(&app);
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_config(app: tauri::AppHandle, config: String) -> Result<(), String> {
    let path = get_config_path(&app);
    fs::write(&path, &config).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_processes() -> Vec<String> {
    let mut processes = Vec::new();
    let sys = sysinfo::System::new_all();
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

#[tauri::command]
fn show_dashboard(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("dashboard") {
        let _ = window.show();
        let _ = window.set_focus();
    } else {
        match tauri::WebviewWindowBuilder::new(
            &app,
            "dashboard",
            tauri::WebviewUrl::App("dashboard.html".into()),
        )
        .title("AgentWatch Dashboard")
        .inner_size(800.0, 600.0)
        .decorations(true)
        .center()
        .build()
        {
            Ok(w) => {
                let _ = w.set_focus();
            }
            Err(e) => {
                eprintln!("Failed to create dashboard window: {}", e);
            }
        }
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_processes, quit_app, show_dashboard, load_config, save_config])
        .setup(|app| {
            let _widget = tauri::WebviewWindowBuilder::new(
                app,
                "widget",
                tauri::WebviewUrl::App("widget.html".into()),
            )
            .title("AgentWatch Widget")
            .inner_size(80.0, 80.0)
            .decorations(false)
            .transparent(true)
            .always_on_top(true)
            .accept_first_mouse(true)
            .visible_on_all_workspaces(true)
            .skip_taskbar(true)
            .resizable(false)
            .build()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
