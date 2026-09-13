// ARRTube: a complete ARR-native video application shell.
// This is the application layer. The renderer/provider can bind the returned UI tree.

signal screen: string = "home"
signal query: string = ""
signal playing: bool = false
signal volume: float = 1.0
signal currentVideo: string = "arr-demo"

fn videoCard(title, channel, image, video) {
    return UI.box([
        UI.image(image, []),
        UI.text(title, []),
        UI.text(channel, [])
    ], [])
}

fn navigation() {
    return UI.column([
        UI.button("Home"),
        UI.button("Shorts"),
        UI.button("Subscriptions"),
        UI.button("Library")
    ], [])
}

fn homeScreen() {
    return UI.column([
        UI.text("ARRTube", []),
        UI.input(query, []),
        UI.row([
            videoCard("ARR Framework", "ARR Labs", "assets/arr.png", "arr-demo"),
            videoCard("Building a language from scratch", "ARR Labs", "assets/compiler.png", "compiler"),
            videoCard("Reactive UI in ARR", "ARR Labs", "assets/ui.png", "reactive-ui")
        ], []),
        UI.row([
            videoCard("Audio runtime", "ARR Labs", "assets/audio.png", "audio"),
            videoCard("ARR graphics", "ARR Labs", "assets/graphics.png", "graphics"),
            videoCard("Signals explained", "ARR Labs", "assets/signals.png", "signals")
        ], [])
    ], [])
}

fn playerScreen() {
    return UI.column([
        UI.text("ARRTube Player", []),
        UI.text(currentVideo, []),
        UI.row([
            UI.button("Play"),
            UI.button("Pause"),
            UI.button("Stop")
        ], []),
        UI.slider(volume, 0, 1, []),
        UI.text("Related", []),
        videoCard("Another ARR video", "ARR Labs", "assets/related.png", "related")
    ], [])
}

fn libraryScreen() {
    return UI.column([
        UI.text("Library", []),
        UI.text("History", []),
        UI.text("Watch later", []),
        UI.text("Liked videos", [])
    ], [])
}

fn app() {
    if screen == "player" {
        return UI.row([navigation(), playerScreen()], [])
    }
    if screen == "library" {
        return UI.row([navigation(), libraryScreen()], [])
    }
    return UI.row([navigation(), homeScreen()], [])
}

watch screen {
    UI.mount(app())
}

watch query {
    UI.mount(app())
}

watch currentVideo {
    UI.mount(app())
}

watch volume {
    UI.mount(app())
}

fn play(video) {
    currentVideo = video
    Audio.play(video, volume)
    emit playing(true)
    emit screen("player")
}

fn pause() {
    Audio.stopAll()
    emit playing(false)
}

boot {
    UI.mount(app())
    print("ARRTube online")
}
