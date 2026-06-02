use std::ffi::OsStr;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use serde::Deserialize;
use tauri::menu::{Menu, MenuBuilder, MenuItemBuilder};
use tauri::tray::TrayIconBuilder;
use tauri::{Emitter, Listener, Manager};

const TRAY_ID: &str = "agent-watch-tray";
const TRAY_OPEN_DASHBOARD_ID: &str = "tray:open-dashboard";
const TRAY_OPEN_SETTINGS_ID: &str = "tray:open-settings";
const TRAY_TOGGLE_WIDGET_ID: &str = "tray:toggle-widget";
const TRAY_QUIT_ID: &str = "tray:quit";

#[derive(Debug, Clone, Deserialize)]
struct TrayMenuItemState {
    id: String,
    label: String,
    state: String,
}

#[derive(Debug, Clone, Deserialize)]
struct TrayMenuGroupState {
    #[serde(rename = "agentType")]
    agent_type: String,
    #[serde(rename = "agentName")]
    agent_name: String,
    count: usize,
    items: Vec<TrayMenuItemState>,
}

#[derive(Debug, Clone, Deserialize)]
struct TrayMenuState {
    tooltip: String,
    #[serde(rename = "emptyLabel")]
    empty_label: Option<String>,
    groups: Vec<TrayMenuGroupState>,
}

#[derive(Debug, Clone)]
struct TrayRuntimeState {
    menu_state: TrayMenuState,
    widget_visible: bool,
}

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

fn ensure_dashboard_window(app: &tauri::AppHandle) -> Option<tauri::WebviewWindow> {
    if let Some(window) = app.get_webview_window("dashboard") {
        let _ = window.show();
        let _ = window.set_focus();
        Some(window)
    } else {
        match tauri::WebviewWindowBuilder::new(
            app,
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
                Some(w)
            }
            Err(e) => {
                eprintln!("Failed to create dashboard window: {}", e);
                None
            }
        }
    }
}

#[tauri::command]
fn show_dashboard(app: tauri::AppHandle) {
    let _ = ensure_dashboard_window(&app);
}

#[tauri::command]
fn set_widget_visible(app: tauri::AppHandle, state: tauri::State<Arc<Mutex<TrayRuntimeState>>>, visible: bool) {
    set_widget_window_visible(&app, &state, visible);
}

fn show_settings(app: &tauri::AppHandle) {
    let _ = ensure_dashboard_window(app);
    let app = app.clone();
    tauri::async_runtime::spawn(async move {
        tokio::time::sleep(Duration::from_millis(250)).await;
        let _ = app.emit_to("dashboard", "tray-open-settings", ());
    });
}

fn state_marker(state: &str) -> &'static str {
    match state {
        "running" => "●",
        "finished" => "●",
        "error" => "●",
        _ => "●",
    }
}

fn build_tray_menu(
    app: &tauri::AppHandle,
    state: &TrayMenuState,
    widget_visible: bool,
) -> tauri::Result<Menu<tauri::Wry>> {
    let mut builder = MenuBuilder::new(app);

    if let Some(empty_label) = &state.empty_label {
        let empty = MenuItemBuilder::with_id("tray:empty", empty_label)
            .enabled(false)
            .build(app)?;
        builder = builder.item(&empty);
    } else {
        for (group_index, group) in state.groups.iter().enumerate() {
            if group_index > 0 {
                builder = builder.separator();
            }

            let title = MenuItemBuilder::with_id(
                format!("tray:group:{}", group.agent_type),
                format!("{} ({})", group.agent_name, group.count),
            )
            .enabled(false)
            .build(app)?;
            builder = builder.item(&title);

            for item in &group.items {
                builder = builder.text(
                    format!("tray:instance:{}", item.id),
                    format!("{} {}", state_marker(&item.state), item.label),
                );
            }
        }
    }

    builder = builder
        .separator()
        .text(
            TRAY_TOGGLE_WIDGET_ID,
            if widget_visible { "✓ floating widget" } else { "show floating widget" },
        )
        .text(TRAY_OPEN_DASHBOARD_ID, "□ open dashboard")
        .text(TRAY_OPEN_SETTINGS_ID, "⚙ settings")
        .separator()
        .text(TRAY_QUIT_ID, "× quit agent-watch");

    builder.build()
}

fn refresh_tray_menu(app: &tauri::AppHandle, state: &TrayRuntimeState) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        if let Ok(menu) = build_tray_menu(app, &state.menu_state, state.widget_visible) {
            let _ = tray.set_menu(Some(menu));
        }
        let _ = tray.set_tooltip(Some(state.menu_state.tooltip.clone()));
    }
}

fn set_widget_window_visible(
    app: &tauri::AppHandle,
    state: &Arc<Mutex<TrayRuntimeState>>,
    visible: bool,
) {
    if let Some(window) = app.get_webview_window("widget") {
        if visible {
            let _ = window.show();
            let _ = window.set_focus();
        } else {
            let _ = window.hide();
        }
    }

    if let Ok(mut state) = state.lock() {
        state.widget_visible = visible;
        refresh_tray_menu(app, &state);
    }
}

fn handle_tray_menu_event(
    app: &tauri::AppHandle,
    state: &Arc<Mutex<TrayRuntimeState>>,
    event: tauri::menu::MenuEvent,
) {
    let id = event.id().as_ref();
    if id == TRAY_OPEN_DASHBOARD_ID || id.starts_with("tray:instance:") {
        let _ = ensure_dashboard_window(app);
    } else if id == TRAY_OPEN_SETTINGS_ID {
        show_settings(app);
    } else if id == TRAY_TOGGLE_WIDGET_ID {
        let next_visible = state.lock().map(|state| !state.widget_visible).unwrap_or(true);
        set_widget_window_visible(app, state, next_visible);
    } else if id == TRAY_QUIT_ID {
        app.exit(0);
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_processes,
            quit_app,
            show_dashboard,
            set_widget_visible,
            load_config,
            save_config
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

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

            let initial_tray_state = TrayMenuState {
                tooltip: "AgentWatch - No agents running".into(),
                empty_label: Some("No agents running".into()),
                groups: Vec::new(),
            };
            let tray_state = Arc::new(Mutex::new(TrayRuntimeState {
                menu_state: initial_tray_state,
                widget_visible: true,
            }));
            app.manage(tray_state.clone());

            let initial_menu = build_tray_menu(
                app.handle(),
                &tray_state.lock().expect("tray state poisoned").menu_state,
                true,
            )?;
            let menu_state_for_handler = tray_state.clone();
            let mut tray_builder = TrayIconBuilder::with_id(TRAY_ID)
                .menu(&initial_menu)
                .tooltip("AgentWatch - No agents running")
                .show_menu_on_left_click(true)
                .on_menu_event(move |app, event| {
                    handle_tray_menu_event(app, &menu_state_for_handler, event);
                });

            if let Some(icon) = app.default_window_icon().cloned() {
                tray_builder = tray_builder.icon(icon);
            }

            let _tray = tray_builder.build(app)?;
            let app_handle = app.handle().clone();
            let tray_state_for_updates = tray_state.clone();
            app.listen_any("tray-menu-updated", move |event| {
                let Ok(state) = serde_json::from_str::<TrayMenuState>(event.payload()) else {
                    return;
                };

                if let Ok(mut runtime_state) = tray_state_for_updates.lock() {
                    runtime_state.menu_state = state;
                    refresh_tray_menu(&app_handle, &runtime_state);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
