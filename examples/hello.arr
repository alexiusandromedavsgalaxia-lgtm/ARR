component App {
    state count: int = 0
    render {
        Text("ARR count = ${count}")
        Button("+1") {
            count += 1
        }
    }
}

fn main() {
    print("ARR online")
    int answer = 42
    print(answer)
}

boot {
    main()
}
