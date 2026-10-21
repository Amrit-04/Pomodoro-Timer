const defaults = { appearance: "auto", theme: "grove", durations: { focus: 25, short: 5, long: 15 }, completed: 0 };
const saved = JSON.parse(localStorage.getItem("focus-grove-settings") || "{}");
const state = { ...defaults, ...saved, durations: { ...defaults.durations, ...(saved.durations || {}) }, mode: "focus", running: false, remaining: 0, total: 0, timer: null, pinned: false };
const $ = (id) => document.getElementById(id);
const els = { time:$("time"), fill:$("progressFill"), start:$("startButton"), reset:$("resetButton"), encouragement:$("encouragement"), tree:$("tree"), sceneTitle:$("sceneTitle"), sceneText:$("sceneText"), status:$("statusText"), count:$("completedCount"), settings:$("settingsDialog"), completion:$("completionDialog") };
const persist = () => localStorage.setItem("focus-grove-settings", JSON.stringify({ appearance:state.appearance, theme:state.theme, durations:state.durations, completed:state.completed }));
function appearance() { const dark = new Date().getHours() < 7 || new Date().getHours() >= 19; document.documentElement.dataset.appearance = state.appearance === "auto" ? (dark ? "dark" : "light") : state.appearance; document.documentElement.dataset.theme = state.theme; }
function format(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`; }
function updateVisual() { const passed = 1 - state.remaining / state.total; const stage = Math.min(3, Math.floor(passed * 4)); els.time.textContent = format(state.remaining); els.fill.style.width = `${Math.max(0, passed * 100)}%`; els.tree.dataset.stage = stage; els.count.textContent = state.completed; const copy = state.theme === "halloween" ? [["A quiet haunt", "The lantern only glows for a kept promise."],["Something stirs", "Keep going. The shadows are rooting for you."],["Nearly enchanted", "A little longer, if you dare."],["The spell is set", "Finish to see what wakes up."]] : [["A seedling waits", "Stay with it. Every minute helps it grow."],["Roots are forming", "You are building more than a habit."],["Branches reach out", "Your attention is doing the work."],["A grove, almost", "See your small promise through."]];
  [els.sceneTitle.textContent, els.sceneText.textContent] = copy[stage];
  els.start.textContent = state.running ? "Pause" : state.remaining === state.total ? `Start ${state.mode === "focus" ? "focus" : "break"}` : "Continue";
  els.status.textContent = state.running ? "time is growing" : state.remaining === state.total ? "ready when you are" : "paused gently";
}
function selectMode(mode) { clearInterval(state.timer); state.running = false; state.mode = mode; state.total = state.remaining = state.durations[mode] * 60; document.querySelectorAll("[data-mode]").forEach(b => b.classList.toggle("active", b.dataset.mode === mode)); updateVisual(); }
function finish() { clearInterval(state.timer); state.running = false; if (state.mode === "focus") { state.completed++; persist(); const halloween = state.theme === "halloween"; $("completionIcon").textContent = halloween ? "👻" : "🌳"; $("completionTitle").textContent = halloween ? "BOO! You did it." : "You grew it."; $("completionMessage").textContent = halloween ? "A harmless little haunt for keeping your promise. Your focus spell is complete." : "A focused session, fully yours. Your grove is a little greener."; els.completion.showModal(); } else { $("completionIcon").textContent = "☕"; $("completionTitle").textContent = "Rest well."; $("completionMessage").textContent = "Your break is complete. Return when you feel ready."; els.completion.showModal(); } updateVisual(); }
function toggleTimer() { if (state.running) { clearInterval(state.timer); state.running = false; updateVisual(); return; } state.running = true; state.timer = setInterval(() => { state.remaining--; if (state.remaining <= 0) { state.remaining = 0; finish(); } updateVisual(); }, 1000); updateVisual(); }
document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => selectMode(b.dataset.mode)));
els.start.addEventListener("click", toggleTimer); els.reset.addEventListener("click", () => selectMode(state.mode));
$("settingsButton").addEventListener("click", () => { $("appearance").value=state.appearance; $("theme").value=state.theme; $("focusDuration").value=state.durations.focus; $("shortDuration").value=state.durations.short; $("longDuration").value=state.durations.long; els.settings.showModal(); });
$("saveSettings").addEventListener("click", (e) => { e.preventDefault(); state.appearance=$("appearance").value; state.theme=$("theme").value; ["focus","short","long"].forEach(k => state.durations[k]=Math.max(1, Number($(`${k}Duration`).value) || defaults.durations[k])); appearance(); persist(); els.settings.close(); selectMode(state.mode); });
$("closeCompletion").addEventListener("click", () => { els.completion.close(); selectMode(state.mode === "focus" ? "short" : "focus"); });
$("pinButton").addEventListener("click", async () => {
  state.pinned = !state.pinned;
  try {
    const appWindow = window.__TAURI__?.window?.getCurrentWindow?.();
    if (!appWindow) throw new Error("Native window API is unavailable");
    await appWindow.setAlwaysOnTop(state.pinned);
    $("pinButton").classList.toggle("pinned", state.pinned);
  } catch {
    state.pinned = false;
    $("pinButton").classList.remove("pinned");
  }
});
appearance(); selectMode("focus"); setInterval(appearance, 60000);
